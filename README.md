# 🧩 Block Blast

Block Blast, React ve Node.js kullanılarak geliştirilmiş web tabanlı bir puzzle oyunudur. Oyuncular blokları 8x8 oyun tahtasına sürükleyerek yerleştirir, satır ve sütunları tamamlayarak puan kazanır. Kullanıcılar kayıt/giriş yapabilir, skorlarını kaydedebilir ve liderlik tablosunda diğer oyuncularla rekabet edebilir.

## 🎮 Özellikler

- 8x8 oyun tahtası
- Sürükle-bırak blok yerleştirme
- Mobil/touch sürükleme desteği
- Satır ve sütun temizleme sistemi
- Full Clear bonusu: `+500`
- Skor sistemi
- Ses efektleri
- Ses aç/kapat özelliği
- Game Over modalı
- Kullanıcı kayıt ve giriş sistemi
- JWT tabanlı kimlik doğrulama
- PostgreSQL veritabanı
- Kullanıcıya özel en yüksek skor kaydetme
- Liderlik tablosu
- Aynı kullanıcının sadece en yüksek skorunun tutulması
- Responsive tasarım

## 🛠️ Kullanılan Teknolojiler

### Frontend

- React
- Vite
- React Router DOM
- Axios
- Context API
- CSS3

### Backend

- Node.js
- Express.js
- PostgreSQL
- pg
- bcryptjs
- jsonwebtoken
- dotenv
- cors

## 📁 Proje Yapısı

```txt
block-blast-game/
│
├── block-blast-frontend/
│   ├── src/
│   │   ├── components/
│   │   │   ├── Board.jsx
│   │   │   ├── Block.jsx
│   │   │   ├── BlockTray.jsx
│   │   │   ├── Cell.jsx
│   │   │   ├── Leaderboard.jsx
│   │   │   └── Navbar.jsx
│   │   │
│   │   ├── context/
│   │   │   └── AuthContext.jsx
│   │   │
│   │   ├── data/
│   │   │   └── blockShapes.js
│   │   │
│   │   ├── pages/
│   │   │   ├── Game.jsx
│   │   │   ├── Login.jsx
│   │   │   └── Register.jsx
│   │   │
│   │   ├── services/
│   │   │   ├── authService.js
│   │   │   └── scoreService.js
│   │   │
│   │   ├── utils/
│   │   │   └── soundEffects.js
│   │   │
│   │   ├── App.jsx
│   │   ├── main.jsx
│   │   └── index.css
│   │
│   └── package.json
│
└── block-blast-backend/
    ├── src/
    │   ├── config/
    │   │   └── db.js
    │   │
    │   ├── controllers/
    │   │   ├── authController.js
    │   │   └── scoreController.js
    │   │
    │   ├── middlewares/
    │   │   └── authMiddleware.js
    │   │
    │   ├── routes/
    │   │   ├── authRoutes.js
    │   │   └── scoreRoutes.js
    │   │
    │   └── server.js
    │
    └── package.json
