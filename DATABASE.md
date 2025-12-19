# Struktur Database MariaDB - Sistem Iuran Warga

## 1. Tabel `users`
Menyimpan data pengguna/warga

| Field | Type | Constraint | Keterangan |
|-------|------|------------|------------|
| id | INT | PRIMARY KEY, AUTO_INCREMENT | ID unik user |
| email | VARCHAR(100) | UNIQUE, NOT NULL | Email user |
| password | VARCHAR(255) | NOT NULL | Password terenkripsi |
| nama | VARCHAR(100) | NOT NULL | Nama lengkap |
| telepon | VARCHAR(20) | NOT NULL | Nomor telepon |
| nomor_rumah | VARCHAR(20) | NOT NULL | Nomor rumah |
| foto_ktp | LONGTEXT | NULL | Base64 foto KTP |
| role | ENUM('admin','warga') | DEFAULT 'warga' | Role user |
| status | ENUM('pending','active','inactive') | DEFAULT 'pending' | Status verifikasi |
| created_at | TIMESTAMP | DEFAULT CURRENT_TIMESTAMP | Tanggal dibuat |
| updated_at | TIMESTAMP | DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP | Tanggal diupdate |

---

## 2. Tabel `bill_types`
Menyimpan jenis-jenis iuran

| Field | Type | Constraint | Keterangan |
|-------|------|------------|------------|
| id | INT | PRIMARY KEY, AUTO_INCREMENT | ID jenis iuran |
| name | VARCHAR(100) | NOT NULL | Nama jenis iuran |
| amount | DECIMAL(10,2) | NOT NULL | Nominal iuran |
| icon | VARCHAR(50) | NULL | Nama icon |
| description | TEXT | NULL | Deskripsi iuran |
| is_recurring | BOOLEAN | DEFAULT TRUE | Iuran berulang atau tidak |
| created_at | TIMESTAMP | DEFAULT CURRENT_TIMESTAMP | Tanggal dibuat |

**Contoh Data:**
- Iuran Bulanan (Rp 150.000)
- Uang Keamanan (Rp 100.000)
- Iuran 17an (Rp 200.000)

---

## 3. Tabel `bills`
Menyimpan tagihan untuk setiap warga

| Field | Type | Constraint | Keterangan |
|-------|------|------------|------------|
| id | INT | PRIMARY KEY, AUTO_INCREMENT | ID tagihan |
| user_id | INT | FOREIGN KEY → users(id) | ID warga |
| bill_type_id | INT | FOREIGN KEY → bill_types(id) | ID jenis iuran |
| month | VARCHAR(20) | NOT NULL | Bulan tagihan (YYYY-MM) |
| amount | DECIMAL(10,2) | NOT NULL | Nominal tagihan |
| status | ENUM('unpaid','paid','overdue') | DEFAULT 'unpaid' | Status pembayaran |
| due_date | DATE | NULL | Tanggal jatuh tempo |
| created_at | TIMESTAMP | DEFAULT CURRENT_TIMESTAMP | Tanggal dibuat |

---

## 4. Tabel `payments`
Menyimpan riwayat pembayaran

| Field | Type | Constraint | Keterangan |
|-------|------|------------|------------|
| id | INT | PRIMARY KEY, AUTO_INCREMENT | ID pembayaran |
| bill_id | INT | FOREIGN KEY → bills(id) | ID tagihan |
| user_id | INT | FOREIGN KEY → users(id) | ID warga |
| amount | DECIMAL(10,2) | NOT NULL | Nominal dibayar |
| payment_method | VARCHAR(50) | NOT NULL | Metode pembayaran |
| payment_date | TIMESTAMP | DEFAULT CURRENT_TIMESTAMP | Tanggal pembayaran |
| proof_image | LONGTEXT | NULL | Base64 bukti transfer |
| status | ENUM('pending','verified','rejected') | DEFAULT 'pending' | Status verifikasi |
| verified_by | INT | FOREIGN KEY → users(id), NULL | Admin yang verifikasi |
| verified_at | TIMESTAMP | NULL | Tanggal verifikasi |
| notes | TEXT | NULL | Catatan |

---

## 5. Tabel `news`
Menyimpan berita dan pengumuman

| Field | Type | Constraint | Keterangan |
|-------|------|------------|------------|
| id | INT | PRIMARY KEY, AUTO_INCREMENT | ID berita |
| title | VARCHAR(200) | NOT NULL | Judul berita |
| content | TEXT | NOT NULL | Isi singkat |
| full_content | TEXT | NOT NULL | Isi lengkap |
| category | ENUM('Pengumuman','Kegiatan','Info') | NOT NULL | Kategori berita |
| author_id | INT | FOREIGN KEY → users(id) | ID pembuat berita |
| image | VARCHAR(255) | NULL | Gambar berita |
| published_at | TIMESTAMP | DEFAULT CURRENT_TIMESTAMP | Tanggal publikasi |
| created_at | TIMESTAMP | DEFAULT CURRENT_TIMESTAMP | Tanggal dibuat |

---

## 6. Tabel `notifications`
Menyimpan notifikasi untuk warga

| Field | Type | Constraint | Keterangan |
|-------|------|------------|------------|
| id | INT | PRIMARY KEY, AUTO_INCREMENT | ID notifikasi |
| user_id | INT | FOREIGN KEY → users(id) | ID penerima |
| title | VARCHAR(200) | NOT NULL | Judul notifikasi |
| message | TEXT | NOT NULL | Isi notifikasi |
| type | VARCHAR(50) | NOT NULL | Tipe notifikasi |
| is_read | BOOLEAN | DEFAULT FALSE | Status baca |
| created_at | TIMESTAMP | DEFAULT CURRENT_TIMESTAMP | Tanggal dibuat |

---

## 7. Tabel `sessions`
Menyimpan session login (opsional, bisa pakai JWT)

| Field | Type | Constraint | Keterangan |
|-------|------|------------|------------|
| id | INT | PRIMARY KEY, AUTO_INCREMENT | ID session |
| user_id | INT | FOREIGN KEY → users(id) | ID user |
| token | VARCHAR(255) | UNIQUE, NOT NULL | Token session |
| device_info | VARCHAR(255) | NULL | Info device |
| expires_at | TIMESTAMP | NOT NULL | Waktu kadaluarsa |
| created_at | TIMESTAMP | DEFAULT CURRENT_TIMESTAMP | Tanggal dibuat |

---

## Relasi Antar Tabel

```
users (1) ──→ (N) bills
users (1) ──→ (N) payments
users (1) ──→ (N) news (sebagai author)
users (1) ──→ (N) notifications
users (1) ──→ (N) sessions

bill_types (1) ──→ (N) bills

bills (1) ──→ (N) payments
```

---

## SQL Script untuk Membuat Database

```sql
CREATE DATABASE iuran_warga CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;
USE iuran_warga;

-- Tabel users
CREATE TABLE users (
    id INT PRIMARY KEY AUTO_INCREMENT,
    email VARCHAR(100) UNIQUE NOT NULL,
    password VARCHAR(255) NOT NULL,
    nama VARCHAR(100) NOT NULL,
    telepon VARCHAR(20) NOT NULL,
    nomor_rumah VARCHAR(20) NOT NULL,
    foto_ktp LONGTEXT,
    role ENUM('admin','warga') DEFAULT 'warga',
    status ENUM('pending','active','inactive') DEFAULT 'pending',
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
);

-- Tabel bill_types
CREATE TABLE bill_types (
    id INT PRIMARY KEY AUTO_INCREMENT,
    name VARCHAR(100) NOT NULL,
    amount DECIMAL(10,2) NOT NULL,
    icon VARCHAR(50),
    description TEXT,
    is_recurring BOOLEAN DEFAULT TRUE,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Tabel bills
CREATE TABLE bills (
    id INT PRIMARY KEY AUTO_INCREMENT,
    user_id INT NOT NULL,
    bill_type_id INT NOT NULL,
    month VARCHAR(20) NOT NULL,
    amount DECIMAL(10,2) NOT NULL,
    status ENUM('unpaid','paid','overdue') DEFAULT 'unpaid',
    due_date DATE,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE,
    FOREIGN KEY (bill_type_id) REFERENCES bill_types(id) ON DELETE CASCADE
);

-- Tabel payments
CREATE TABLE payments (
    id INT PRIMARY KEY AUTO_INCREMENT,
    bill_id INT NOT NULL,
    user_id INT NOT NULL,
    amount DECIMAL(10,2) NOT NULL,
    payment_method VARCHAR(50) NOT NULL,
    payment_date TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    proof_image LONGTEXT,
    status ENUM('pending','verified','rejected') DEFAULT 'pending',
    verified_by INT,
    verified_at TIMESTAMP NULL,
    notes TEXT,
    FOREIGN KEY (bill_id) REFERENCES bills(id) ON DELETE CASCADE,
    FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE,
    FOREIGN KEY (verified_by) REFERENCES users(id) ON DELETE SET NULL
);

-- Tabel news
CREATE TABLE news (
    id INT PRIMARY KEY AUTO_INCREMENT,
    title VARCHAR(200) NOT NULL,
    content TEXT NOT NULL,
    full_content TEXT NOT NULL,
    category ENUM('Pengumuman','Kegiatan','Info') NOT NULL,
    author_id INT NOT NULL,
    image VARCHAR(255),
    published_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (author_id) REFERENCES users(id) ON DELETE CASCADE
);

-- Tabel notifications
CREATE TABLE notifications (
    id INT PRIMARY KEY AUTO_INCREMENT,
    user_id INT NOT NULL,
    title VARCHAR(200) NOT NULL,
    message TEXT NOT NULL,
    type VARCHAR(50) NOT NULL,
    is_read BOOLEAN DEFAULT FALSE,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE
);

-- Tabel sessions
CREATE TABLE sessions (
    id INT PRIMARY KEY AUTO_INCREMENT,
    user_id INT NOT NULL,
    token VARCHAR(255) UNIQUE NOT NULL,
    device_info VARCHAR(255),
    expires_at TIMESTAMP NOT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE
);

-- Insert data default admin
INSERT INTO users (email, password, nama, telepon, nomor_rumah, role, status) 
VALUES ('admin@example.com', '$2y$10$92IXUNpkjO0rOQ5byMi.Ye4oKoEa3Ro9llC/.og/at2.uheWG/igi', 'Administrator', '081234567890', 'A-000', 'admin', 'active');

-- Insert data jenis iuran
INSERT INTO bill_types (name, amount, icon, description, is_recurring) VALUES
('Iuran Bulanan', 150000.00, 'calendar', 'Iuran wajib bulanan untuk operasional RT', TRUE),
('Uang Keamanan', 100000.00, 'shield-checkmark', 'Iuran keamanan lingkungan', TRUE),
('Iuran 17an', 200000.00, 'flag', 'Iuran untuk perayaan kemerdekaan', FALSE);
```

---

## Index untuk Optimasi Query

```sql
-- Index untuk pencarian dan filter
CREATE INDEX idx_bills_user_status ON bills(user_id, status);
CREATE INDEX idx_bills_month ON bills(month);
CREATE INDEX idx_payments_user ON payments(user_id);
CREATE INDEX idx_payments_status ON payments(status);
CREATE INDEX idx_notifications_user_read ON notifications(user_id, is_read);
CREATE INDEX idx_news_category ON news(category);
```
