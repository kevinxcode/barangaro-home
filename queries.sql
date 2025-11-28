-- ============================================
-- QUERY SQL UNTUK SISTEM IURAN WARGA
-- ============================================

-- ============================================
-- 1. QUERY UNTUK USERS/WARGA
-- ============================================

-- Register user baru
INSERT INTO users (email, password, nama, telepon, nomor_rumah, foto_ktp, role, status) 
VALUES (
    'user@example.com', 
    '$2y$10$hashedpassword', 
    'Nama Lengkap', 
    '081234567890', 
    'A-123', 
    'data:image/jpeg;base64,/9j/4AAQSkZJRg...', 
    'warga', 
    'pending'
);

-- Login user
SELECT id, email, nama, telepon, nomor_rumah, role, status 
FROM users 
WHERE email = 'user@example.com' AND status = 'active';

-- Get user profile
SELECT id, email, nama, telepon, nomor_rumah, foto_ktp, role, status, created_at 
FROM users 
WHERE id = 1;

-- Update user profile
UPDATE users 
SET nama = 'Nama Baru', telepon = '081234567890', nomor_rumah = 'A-123' 
WHERE id = 1;

-- Verifikasi user oleh admin
UPDATE users 
SET status = 'active' 
WHERE id = 1;

-- Get semua user pending verifikasi
SELECT id, email, nama, telepon, nomor_rumah, foto_ktp, created_at 
FROM users 
WHERE status = 'pending' 
ORDER BY created_at DESC;

-- Get semua warga aktif
SELECT id, email, nama, telepon, nomor_rumah 
FROM users 
WHERE role = 'warga' AND status = 'active' 
ORDER BY nomor_rumah ASC;


-- ============================================
-- 2. QUERY UNTUK BILLS/TAGIHAN
-- ============================================

-- Get semua tagihan user
SELECT b.id, b.month, b.amount, b.status, b.due_date, bt.name as bill_type, bt.icon
FROM bills b
JOIN bill_types bt ON b.bill_type_id = bt.id
WHERE b.user_id = 1
ORDER BY b.month DESC;

-- Get tagihan belum dibayar
SELECT b.id, b.month, b.amount, b.due_date, bt.name as bill_type, bt.icon
FROM bills b
JOIN bill_types bt ON b.bill_type_id = bt.id
WHERE b.user_id = 1 AND b.status = 'unpaid'
ORDER BY b.due_date ASC;

-- Hitung total tagihan belum dibayar
SELECT COUNT(*) as total_bills, SUM(amount) as total_amount
FROM bills
WHERE user_id = 1 AND status = 'unpaid';

-- Generate tagihan bulanan untuk semua warga
INSERT INTO bills (user_id, bill_type_id, month, amount, due_date, status)
SELECT u.id, bt.id, '2024-03', bt.amount, '2024-03-10', 'unpaid'
FROM users u
CROSS JOIN bill_types bt
WHERE u.role = 'warga' AND u.status = 'active' AND bt.is_recurring = TRUE;

-- Generate tagihan khusus (non-recurring)
INSERT INTO bills (user_id, bill_type_id, month, amount, due_date, status)
SELECT u.id, 3, '2024', 200000, '2024-08-17', 'unpaid'
FROM users u
WHERE u.role = 'warga' AND u.status = 'active';

-- Update status tagihan menjadi paid
UPDATE bills 
SET status = 'paid' 
WHERE id = 1;

-- Get laporan tagihan per bulan
SELECT 
    b.month,
    bt.name as bill_type,
    COUNT(*) as total_bills,
    SUM(CASE WHEN b.status = 'paid' THEN 1 ELSE 0 END) as paid_count,
    SUM(CASE WHEN b.status = 'unpaid' THEN 1 ELSE 0 END) as unpaid_count,
    SUM(CASE WHEN b.status = 'paid' THEN b.amount ELSE 0 END) as total_paid,
    SUM(CASE WHEN b.status = 'unpaid' THEN b.amount ELSE 0 END) as total_unpaid
FROM bills b
JOIN bill_types bt ON b.bill_type_id = bt.id
WHERE b.month = '2024-03'
GROUP BY b.month, bt.name;


-- ============================================
-- 3. QUERY UNTUK PAYMENTS/PEMBAYARAN
-- ============================================

-- Insert pembayaran baru
INSERT INTO payments (bill_id, user_id, amount, payment_method, proof_image, status)
VALUES (1, 1, 150000, 'Transfer Bank', 'data:image/jpeg;base64,/9j/4AAQ...', 'pending');

-- Get riwayat pembayaran user
SELECT 
    p.id, p.amount, p.payment_method, p.payment_date, p.status,
    b.month, bt.name as bill_type
FROM payments p
JOIN bills b ON p.bill_id = b.id
JOIN bill_types bt ON b.bill_type_id = bt.id
WHERE p.user_id = 1 AND p.status = 'verified'
ORDER BY p.payment_date DESC;

-- Get pembayaran pending verifikasi
SELECT 
    p.id, p.amount, p.payment_method, p.payment_date, p.proof_image,
    u.nama, u.nomor_rumah,
    b.month, bt.name as bill_type
FROM payments p
JOIN users u ON p.user_id = u.id
JOIN bills b ON p.bill_id = b.id
JOIN bill_types bt ON b.bill_type_id = bt.id
WHERE p.status = 'pending'
ORDER BY p.payment_date DESC;

-- Verifikasi pembayaran oleh admin
UPDATE payments 
SET status = 'verified', verified_by = 1, verified_at = NOW() 
WHERE id = 1;

-- Update status bill setelah pembayaran diverifikasi
UPDATE bills 
SET status = 'paid' 
WHERE id = (SELECT bill_id FROM payments WHERE id = 1);

-- Reject pembayaran
UPDATE payments 
SET status = 'rejected', verified_by = 1, verified_at = NOW(), notes = 'Bukti transfer tidak valid' 
WHERE id = 1;

-- Laporan pembayaran per bulan
SELECT 
    DATE_FORMAT(p.payment_date, '%Y-%m') as month,
    COUNT(*) as total_payments,
    SUM(p.amount) as total_amount,
    p.payment_method
FROM payments p
WHERE p.status = 'verified'
GROUP BY DATE_FORMAT(p.payment_date, '%Y-%m'), p.payment_method
ORDER BY month DESC;


-- ============================================
-- 4. QUERY UNTUK NEWS/BERITA
-- ============================================

-- Insert berita baru
INSERT INTO news (title, content, full_content, category, author_id, image)
VALUES (
    'Rapat Warga Bulan Maret',
    'Akan diadakan rapat warga pada tanggal 15 Maret 2024...',
    'Akan diadakan rapat warga pada tanggal 15 Maret 2024 pukul 19.00 WIB di balai warga. Agenda rapat meliputi...',
    'Pengumuman',
    1,
    NULL
);

-- Get semua berita
SELECT n.id, n.title, n.content, n.category, n.published_at, u.nama as author
FROM news n
JOIN users u ON n.author_id = u.id
ORDER BY n.published_at DESC;

-- Get berita by category
SELECT id, title, content, full_content, category, published_at
FROM news
WHERE category = 'Pengumuman'
ORDER BY published_at DESC;

-- Get detail berita
SELECT n.id, n.title, n.content, n.full_content, n.category, n.image, n.published_at, u.nama as author
FROM news n
JOIN users u ON n.author_id = u.id
WHERE n.id = 1;

-- Update berita
UPDATE news 
SET title = 'Judul Baru', content = 'Konten singkat', full_content = 'Konten lengkap' 
WHERE id = 1;

-- Delete berita
DELETE FROM news WHERE id = 1;


-- ============================================
-- 5. QUERY UNTUK NOTIFICATIONS
-- ============================================

-- Insert notifikasi untuk user tertentu
INSERT INTO notifications (user_id, title, message, type)
VALUES (1, 'Tagihan Baru', 'Iuran bulan Maret 2024 telah tersedia', 'bill');

-- Insert notifikasi untuk semua warga
INSERT INTO notifications (user_id, title, message, type)
SELECT id, 'Pengumuman', 'Rapat warga akan diadakan tanggal 15 Maret', 'announcement'
FROM users
WHERE role = 'warga' AND status = 'active';

-- Get notifikasi user
SELECT id, title, message, type, is_read, created_at
FROM notifications
WHERE user_id = 1
ORDER BY created_at DESC;

-- Get notifikasi belum dibaca
SELECT id, title, message, type, created_at
FROM notifications
WHERE user_id = 1 AND is_read = FALSE
ORDER BY created_at DESC;

-- Hitung notifikasi belum dibaca
SELECT COUNT(*) as unread_count
FROM notifications
WHERE user_id = 1 AND is_read = FALSE;

-- Mark notifikasi sebagai dibaca
UPDATE notifications 
SET is_read = TRUE 
WHERE id = 1;

-- Mark semua notifikasi sebagai dibaca
UPDATE notifications 
SET is_read = TRUE 
WHERE user_id = 1;

-- Delete notifikasi lama (lebih dari 30 hari)
DELETE FROM notifications 
WHERE created_at < DATE_SUB(NOW(), INTERVAL 30 DAY);


-- ============================================
-- 6. QUERY UNTUK SESSIONS
-- ============================================

-- Insert session baru
INSERT INTO sessions (user_id, token, device_info, expires_at)
VALUES (1, 'random_token_string', 'Android 12', DATE_ADD(NOW(), INTERVAL 7 DAY));

-- Validasi session
SELECT s.id, s.user_id, u.email, u.nama, u.role
FROM sessions s
JOIN users u ON s.user_id = u.id
WHERE s.token = 'random_token_string' AND s.expires_at > NOW();

-- Delete session (logout)
DELETE FROM sessions WHERE token = 'random_token_string';

-- Delete expired sessions
DELETE FROM sessions WHERE expires_at < NOW();

-- Delete semua session user (logout all devices)
DELETE FROM sessions WHERE user_id = 1;


-- ============================================
-- 7. QUERY LAPORAN & STATISTIK
-- ============================================

-- Dashboard admin - ringkasan
SELECT 
    (SELECT COUNT(*) FROM users WHERE role = 'warga' AND status = 'active') as total_warga,
    (SELECT COUNT(*) FROM users WHERE status = 'pending') as pending_users,
    (SELECT COUNT(*) FROM bills WHERE status = 'unpaid') as unpaid_bills,
    (SELECT SUM(amount) FROM bills WHERE status = 'unpaid') as total_unpaid_amount,
    (SELECT SUM(amount) FROM payments WHERE status = 'verified' AND MONTH(payment_date) = MONTH(NOW())) as monthly_income;

-- Laporan warga yang belum bayar
SELECT 
    u.nama, u.nomor_rumah, u.telepon,
    COUNT(b.id) as total_unpaid,
    SUM(b.amount) as total_amount
FROM users u
JOIN bills b ON u.id = b.user_id
WHERE b.status = 'unpaid'
GROUP BY u.id, u.nama, u.nomor_rumah, u.telepon
ORDER BY total_amount DESC;

-- Laporan pembayaran per warga
SELECT 
    u.nama, u.nomor_rumah,
    COUNT(p.id) as total_payments,
    SUM(p.amount) as total_paid
FROM users u
LEFT JOIN payments p ON u.id = p.user_id AND p.status = 'verified'
WHERE u.role = 'warga' AND u.status = 'active'
GROUP BY u.id, u.nama, u.nomor_rumah
ORDER BY u.nomor_rumah;

-- Laporan keuangan bulanan
SELECT 
    DATE_FORMAT(p.payment_date, '%Y-%m') as month,
    bt.name as bill_type,
    COUNT(p.id) as total_transactions,
    SUM(p.amount) as total_income
FROM payments p
JOIN bills b ON p.bill_id = b.id
JOIN bill_types bt ON b.bill_type_id = bt.id
WHERE p.status = 'verified'
GROUP BY DATE_FORMAT(p.payment_date, '%Y-%m'), bt.name
ORDER BY month DESC, bt.name;

-- Top 10 warga paling rajin bayar
SELECT 
    u.nama, u.nomor_rumah,
    COUNT(p.id) as payment_count,
    SUM(p.amount) as total_paid
FROM users u
JOIN payments p ON u.id = p.user_id
WHERE p.status = 'verified'
GROUP BY u.id, u.nama, u.nomor_rumah
ORDER BY payment_count DESC, total_paid DESC
LIMIT 10;

-- Warga yang menunggak lebih dari 3 bulan
SELECT 
    u.nama, u.nomor_rumah, u.telepon,
    COUNT(b.id) as months_unpaid,
    SUM(b.amount) as total_debt
FROM users u
JOIN bills b ON u.id = b.user_id
WHERE b.status = 'unpaid'
GROUP BY u.id, u.nama, u.nomor_rumah, u.telepon
HAVING COUNT(b.id) >= 3
ORDER BY months_unpaid DESC;
