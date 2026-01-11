# Barangaro Home - Frontend Documentation

## 📱 Aplikasi Mobile React Native

Aplikasi mobile untuk sistem manajemen iuran warga Barangaro Kirana Homes 2.

---

## 🚀 Tech Stack

- **React Native** - Framework mobile
- **Expo** - Development platform
- **React Navigation** - Navigasi antar screen
- **AsyncStorage** - Local storage untuk session
- **Expo Image Picker** - Upload foto
- **Expo Clipboard** - Copy to clipboard

---

## 📁 Struktur Project

```
barangaro-home/
├── assets/              # Gambar dan icon
├── components/          # Screen components
│   ├── LoginScreen.js
│   ├── RegisterScreen.js
│   ├── HomeScreen.js
│   ├── PaymentScreen.js
│   ├── PaymentStatusScreen.js
│   ├── PaymentVerifiedScreen.js
│   ├── NewsScreen.js
│   ├── NewsDetailScreen.js
│   ├── HistoryScreen.js
│   ├── NotificationScreen.js
│   └── AccountScreen.js
├── config/
│   └── api.js          # Konfigurasi API endpoints
├── App.js              # Main app component
├── app.json            # Expo configuration
└── package.json        # Dependencies
```

---

## 🎨 Fitur Aplikasi

### 1. Authentication
- **Login** - Login dengan email & password
- **Register** - Registrasi warga baru dengan upload KTP
- **Logout** - Keluar dari aplikasi

### 2. Home (Dashboard)
- Ringkasan tagihan (total unpaid, pending count)
- Daftar tagihan dengan status (unpaid, pending, paid)
- Pull to refresh
- Notifikasi badge

### 3. Pembayaran
- Pilih metode pembayaran (Bank Transfer, E-wallet)
- Info rekening/nomor dinamis dari database
- Upload bukti transfer
- Copy nominal & nomor rekening
- Pull to refresh

### 4. Status Pembayaran
- Lihat status verifikasi
- Detail pembayaran
- Bukti transfer (tap untuk zoom)

### 5. Riwayat Pembayaran
- List pembayaran yang sudah verified
- Detail per pembayaran

### 6. Berita & Pengumuman
- List berita dengan kategori
- Detail berita lengkap
- Pull to refresh

### 7. Notifikasi
- List notifikasi
- Status read/unread
- Mark as read

### 8. Profile
- Info user (nama, email, nomor rumah, telepon)
- Riwayat pembayaran
- Logout

---

## 🔧 Setup & Installation

### 1. Install Dependencies
```bash
cd barangaro-home
npm install
```

### 2. Konfigurasi API
Edit file `config/api.js`:
```javascript
const API_BASE_URL = 'http://YOUR_IP:8000';
```
Ganti `YOUR_IP` dengan IP komputer Anda.

### 3. Jalankan Aplikasi
```bash
npm start
```

Scan QR code dengan Expo Go app di HP.

---

## 📡 API Integration

### Endpoints yang Digunakan

**Authentication:**
- `POST /auth/login` - Login
- `POST /auth/register` - Register
- `POST /auth/logout` - Logout

**Bills:**
- `GET /bills` - Get all bills
- `GET /bills/summary` - Get summary

**Payments:**
- `POST /payments/create` - Create payment
- `GET /payments/history` - Get payment history
- `GET /payments/detail/:id` - Get payment detail

**News:**
- `GET /news` - Get all news
- `GET /news/detail/:id` - Get news detail

**Notifications:**
- `GET /notifications` - Get all notifications
- `POST /notifications/mark_read/:id` - Mark as read

**Settings:**
- `GET /settings/bank_info` - Get bank info
- `GET /settings/payment_methods` - Get payment methods

---

## 🎨 Design System

### Colors
- **Primary:** `#a32620` (Merah Maroon)
- **Success:** `#4CAF50` (Hijau)
- **Warning:** `#FF9800` (Orange)
- **Background:** `#f5f5f5` (Abu-abu terang)

### Typography
- **Title:** 24-32px, Bold
- **Subtitle:** 14-16px, Regular
- **Body:** 14-15px, Regular
- **Caption:** 12-13px, Regular

---

## 📦 Dependencies

```json
{
  "@react-native-async-storage/async-storage": "^2.2.0",
  "@react-navigation/bottom-tabs": "^7.8.7",
  "@react-navigation/native": "^7.1.20",
  "@react-navigation/native-stack": "^7.6.3",
  "expo": "~54.0.30",
  "expo-clipboard": "^8.0.8",
  "expo-image-picker": "~17.0.10",
  "react": "19.1.0",
  "react-native": "0.81.5"
}
```

---

## 🔐 Session Management

Session disimpan di AsyncStorage:
- `session` - Status login (true/false)
- `token` - Token autentikasi
- `user` - Data user (JSON)

---

## 📱 Testing

### Test Accounts
**Warga:**
- Email: `warga1@test.com`
- Password: `password`

**Admin:**
- Email: `admin@barangaro.com`
- Password: `password`

---

## 🐛 Troubleshooting

### Network Request Failed
- Pastikan HP dan komputer di WiFi yang sama
- Ganti IP di `config/api.js` dengan IP komputer
- Matikan Windows Firewall atau allow port 8000

### Keyboard Menutupi Input
- Sudah ada KeyboardAvoidingView di LoginScreen
- Gunakan ScrollView untuk screen panjang

### Image Upload Gagal
- Pastikan permission kamera/galeri sudah diizinkan
- Cek format base64 sudah benar

---

## 📝 Notes

- Gunakan Expo Go untuk testing di HP
- Untuk production, build APK dengan `eas build`
- Pastikan backend sudah running sebelum test
- Database harus sudah diimport dengan sample data

---

## 👨‍💻 Developer

Developed for Barangaro Kirana Homes 2
