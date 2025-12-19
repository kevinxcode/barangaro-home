-- ============================================
-- QUERY TAMBAHAN UNTUK SISTEM IURAN WARGA
-- ============================================

-- ============================================
-- 1. QUERY UNTUK PAYMENT HISTORY
-- ============================================

-- Get history perubahan status payment
SELECT 
    ph.id, ph.old_status, ph.new_status, ph.notes, ph.created_at,
    u.nama as changed_by_name,
    p.amount, p.payment_method
FROM payment_history ph
JOIN users u ON ph.changed_by = u.id
JOIN payments p ON ph.payment_id = p.id
WHERE ph.payment_id = 1
ORDER BY ph.created_at DESC;

-- Get audit trail untuk payment tertentu
SELECT 
    ph.created_at as timestamp,
    CONCAT(ph.old_status, ' → ', ph.new_status) as status_change,
    u.nama as changed_by,
    ph.notes
FROM payment_history ph
JOIN users u ON ph.changed_by = u.id
WHERE ph.payment_id = 1
ORDER BY ph.created_at ASC;


-- ============================================
-- 2. QUERY UNTUK SETTINGS
-- ============================================

-- Get semua settings
SELECT key_name, value, description FROM settings;

-- Get setting tertentu
SELECT value FROM settings WHERE key_name = 'bank_account';

-- Update setting
UPDATE settings SET value = '123-000-9999' WHERE key_name = 'bank_account';

-- Get informasi bank untuk payment
SELECT 
    (SELECT value FROM settings WHERE key_name = 'bank_name') as bank_name,
    (SELECT value FROM settings WHERE key_name = 'bank_account') as bank_account,
    (SELECT value FROM settings WHERE key_name = 'bank_account_name') as bank_account_name;


-- ============================================
-- 3. QUERY ADVANCED & REPORTING
-- ============================================

-- Laporan pembayaran dengan history verifikasi
SELECT 
    p.id, p.amount, p.payment_date, p.status,
    u.nama, u.nomor_rumah,
    b.month, bt.name as bill_type,
    v.nama as verified_by_name, p.verified_at,
    (SELECT COUNT(*) FROM payment_history WHERE payment_id = p.id) as history_count
FROM payments p
JOIN users u ON p.user_id = u.id
JOIN bills b ON p.bill_id = b.id
JOIN bill_types bt ON b.bill_type_id = bt.id
LEFT JOIN users v ON p.verified_by = v.id
WHERE p.status = 'verified'
ORDER BY p.verified_at DESC;

-- Dashboard lengkap untuk admin
SELECT 
    'Total Warga' as metric,
    COUNT(*) as value
FROM users WHERE role = 'warga' AND status = 'active'
UNION ALL
SELECT 
    'Pending Registration',
    COUNT(*)
FROM users WHERE status = 'pending'
UNION ALL
SELECT 
    'Tagihan Belum Dibayar',
    COUNT(*)
FROM bills WHERE status = 'unpaid'
UNION ALL
SELECT 
    'Pembayaran Pending',
    COUNT(*)
FROM payments WHERE status = 'pending'
UNION ALL
SELECT 
    'Total Pemasukan Bulan Ini',
    COALESCE(SUM(amount), 0)
FROM payments 
WHERE status = 'verified' 
AND MONTH(payment_date) = MONTH(NOW()) 
AND YEAR(payment_date) = YEAR(NOW());

-- Cek tagihan overdue (lewat jatuh tempo)
UPDATE bills 
SET status = 'overdue' 
WHERE status = 'unpaid' 
AND due_date < CURDATE();

-- Get warga dengan tagihan overdue
SELECT 
    u.nama, u.nomor_rumah, u.telepon,
    b.month, b.amount, b.due_date,
    DATEDIFF(CURDATE(), b.due_date) as days_overdue
FROM users u
JOIN bills b ON u.id = b.user_id
WHERE b.status = 'overdue'
ORDER BY b.due_date ASC;

-- Laporan kolektibilitas pembayaran
SELECT 
    DATE_FORMAT(b.month, '%Y-%m') as period,
    COUNT(DISTINCT b.user_id) as total_warga,
    SUM(CASE WHEN b.status = 'paid' THEN 1 ELSE 0 END) as paid_count,
    SUM(CASE WHEN b.status = 'pending' THEN 1 ELSE 0 END) as pending_count,
    SUM(CASE WHEN b.status = 'unpaid' THEN 1 ELSE 0 END) as unpaid_count,
    SUM(CASE WHEN b.status = 'overdue' THEN 1 ELSE 0 END) as overdue_count,
    ROUND((SUM(CASE WHEN b.status = 'paid' THEN 1 ELSE 0 END) / COUNT(*)) * 100, 2) as collection_rate
FROM bills b
GROUP BY DATE_FORMAT(b.month, '%Y-%m')
ORDER BY period DESC;

-- Ranking warga berdasarkan ketepatan pembayaran
SELECT 
    u.nama, u.nomor_rumah,
    COUNT(p.id) as total_payments,
    AVG(DATEDIFF(p.payment_date, b.due_date)) as avg_days_late,
    SUM(CASE WHEN p.payment_date <= b.due_date THEN 1 ELSE 0 END) as on_time_count
FROM users u
JOIN bills b ON u.id = b.user_id
JOIN payments p ON b.id = p.bill_id
WHERE p.status = 'verified'
GROUP BY u.id, u.nama, u.nomor_rumah
ORDER BY on_time_count DESC, avg_days_late ASC
LIMIT 10;
