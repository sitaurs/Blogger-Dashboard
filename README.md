# Pusat Kendali Blogger

Sebuah aplikasi web full-stack yang elegan dan powerful untuk mengelola blog Blogger dengan antarmuka yang modern dan fitur yang lengkap.

## 🎯 Fitur Utama

- **Dashboard Modern**: Antarmuka dengan desain glassmorphism yang memukau
- **Manajemen Postingan**: CRUD lengkap untuk postingan blog dengan rich text editor
- **Manajemen Halaman**: Kelola halaman statis dengan mudah
- **Moderasi Komentar**: Sistem moderasi komentar yang efisien
- **Analisis Statistik**: Grafik dan chart untuk menganalisis performa blog
- **Pustaka Konten**: Manajemen file media yang terintegrasi
- **Responsif**: Desain yang responsif untuk semua perangkat
- **Animasi Halus**: Menggunakan Framer Motion untuk transisi yang mulus

## 🚀 Teknologi yang Digunakan

### Frontend
- **React 18+** dengan TypeScript
- **Vite** sebagai build tool
- **Tailwind CSS** untuk styling
- **Framer Motion** untuk animasi
- **React Router** untuk routing
- **TanStack Query** untuk state management
- **Recharts** untuk visualisasi data
- **Lucide React** untuk ikon

### Backend
- **Node.js** dengan Express.js
- **TypeScript** untuk type safety
- **MongoDB** dengan Mongoose ODM
- **Google APIs** untuk integrasi Blogger
- **JWT** untuk authentication
- **Multer** untuk file upload
- **Helmet** untuk security headers
- **CORS** untuk cross-origin requests

## 📋 Prasyarat

- Node.js 18 atau lebih tinggi
- npm atau yarn
- MongoDB (local atau cloud)
- Google Cloud Console project dengan Blogger API v3 enabled

## 🚀 Cara Menjalankan Aplikasi (Quick Start)

### 1. Clone Repository
```bash
git clone https://github.com/sitaurs/Blogger-Dashboard
cd pusat-kendali-blogger
```

### 2. Install Dependencies

**Frontend:**
```bash
npm install
```

**Backend:**
```bash
cd backend
npm install
cd ..
```

### 3. Jalankan Aplikasi

**Opsi A: Jalankan Keduanya Sekaligus (Recommended)**
```bash
# Terminal 1: Jalankan Backend
cd backend
npm run dev

# Terminal 2: Jalankan Frontend (buka terminal baru)
npm run dev
```

**Opsi B: Jalankan Terpisah**
```bash
# Backend (Terminal 1)
cd backend
node server.js

# Frontend (Terminal 2)
npm run dev
```

### 4. Akses Aplikasi
- **Frontend**: `http://localhost:5173`
- **Backend API**: `http://localhost:3002`
- **Login Default**: 
  - Username: `admin`
  - Password: `admin123`

## 🎮 Mode Demo vs Production

### Mode Demo (Default - Siap Pakai)
Aplikasi saat ini berjalan dalam **mode demo** dengan:
- ✅ Mock data untuk semua fitur
- ✅ Tidak memerlukan MongoDB
- ✅ Tidak memerlukan Google OAuth setup
- ✅ Siap pakai langsung untuk testing UI/UX
- ✅ Login: admin/admin123

Untuk beralih ke mode produksi, ubah variabel `APP_MODE` pada file `.env` menjadi `production`.

### Mode Production (Real Blogger Integration)
Untuk menggunakan dengan Blogger API sesungguhnya:

#### A. Setup Google Cloud Console

1. **Buat Project Baru**
   - Kunjungi [Google Cloud Console](https://console.cloud.google.com/)
   - Buat project baru atau pilih project yang sudah ada
   - Aktifkan Blogger API v3

2. **Konfigurasi OAuth 2.0**
   - Buka "Credentials" di Google Cloud Console
   - Buat OAuth 2.0 Client ID
   - Tambahkan redirect URI: `http://localhost:3002/auth/google/callback`
   - Download file `credentials.json`

3. **Setup Consent Screen**
   - Konfigurasi OAuth consent screen
   - Tambahkan scope yang diperlukan untuk Blogger API

#### B. Konfigurasi Environment

1. **Setup MongoDB**
   ```bash
   # Install MongoDB (Ubuntu)
   sudo apt update
   sudo apt install mongodb
   sudo systemctl start mongodb
   sudo systemctl enable mongodb
   ```

2. **Konfigurasi Environment Variables**
   
   Edit file `backend/.env`:
   ```env
   # Database
   MONGODB_URI=mongodb://localhost:27017/blogger-dashboard
   
   # Google OAuth
   GOOGLE_CLIENT_ID=your_google_client_id
   GOOGLE_CLIENT_SECRET=your_google_client_secret
   GOOGLE_REDIRECT_URI=http://localhost:3002/auth/google/callback
   
   # JWT
   JWT_SECRET=your_jwt_secret_key_here_make_it_very_long_and_secure
   JWT_EXPIRES_IN=7d
   
   # Server
   PORT=3002
   NODE_ENV=production
   APP_MODE=production

   # Admin Account
   ADMIN_USERNAME=admin
   ADMIN_PASSWORD=your_secure_password
   ```

#### C. Setup OAuth Token (One-Time)

1. **Generate OAuth Token**
   ```bash
   cd backend
   npm run generate-token
   ```

2. **Ikuti Instruksi Script**
   - Script akan menampilkan URL authorization Google
   - Buka URL di browser dan login ke akun Google Anda
   - Copy authorization code dari URL callback
   - Paste code ke terminal
   - Script akan menyimpan refresh token ke database

#### D. Update Backend Service

Edit `backend/src/services/bloggerService.js` dan uncomment kode production:
```javascript
// Uncomment production code dan comment mock data
const response = await this.blogger.posts.list({
  blogId,
  maxResults: options.maxResults || 10,
  pageToken: options.pageToken,
  status: options.status || ['live', 'draft']
});
return response.data;
```

## 📁 Struktur Project

```
pusat-kendali-blogger/
├── src/                    # Frontend React
│   ├── components/         # Komponen React
│   ├── contexts/          # Context providers
│   ├── pages/             # Halaman utama
│   └── App.tsx
├── backend/               # Backend Server
│   ├── src/
│   │   ├── controllers/   # Route controllers
│   │   ├── models/        # Database models
│   │   ├── middleware/    # Express middleware
│   │   ├── routes/        # API routes
│   │   ├── services/      # Business logic
│   │   └── utils/         # Helper functions
│   ├── scripts/
│   │   └── generate-token.js
│   └── server.js
├── public/
└── README.md
```

## 🔧 Development Commands

### Frontend
```bash
npm run dev          # Start development server
npm run build        # Build for production
npm run preview      # Preview production build
npm run lint         # Run ESLint
```

### Backend
```bash
cd backend
npm run dev          # Start with nodemon (auto-reload)
npm start            # Start production server
npm run generate-token  # Generate OAuth token
```

## 🔒 Keamanan

- **Authentication**: JWT-based authentication untuk admin
- **Authorization**: OAuth 2.0 untuk Google API access
- **Security Headers**: Helmet.js untuk security headers
- **Rate Limiting**: Protection terhadap brute force attacks
- **Input Validation**: Validasi semua input user
- **Environment Variables**: Sensitive data disimpan dalam environment variables

## 📊 API Endpoints

### Authentication
- `POST /api/admin/login` - Admin login
- `GET /api/admin/me` - Get current admin info

### Blog Management
- `GET /api/blogs` - Get all blogs
- `GET /api/blogs/:id` - Get specific blog

### Posts
- `GET /api/posts` - Get all posts (with pagination, search, filter)
- `POST /api/posts` - Create new post
- `GET /api/posts/:id` - Get specific post
- `PUT /api/posts/:id` - Update post
- `DELETE /api/posts/:id` - Delete post

### Pages
- `GET /api/pages` - Get all pages
- `POST /api/pages` - Create new page
- `GET /api/pages/:id` - Get specific page
- `PUT /api/pages/:id` - Update page
- `DELETE /api/pages/:id` - Delete page

### Comments
- `GET /api/comments` - Get all comments (with filter)
- `PUT /api/comments/:id` - Update comment status
- `DELETE /api/comments/:id` - Delete comment

### Statistics
- `GET /api/stats/overall` - Get dashboard statistics
- `GET /api/stats/:period` - Get statistics (daily/weekly/monthly)

### Content
- `POST /api/content/upload` - Upload file
- `GET /api/content` - Get all media files
- `DELETE /api/content/:id` - Delete file

### Health Check
- `GET /api/health` - Server health status

## 🎨 Desain & Styling

### Tema Glassmorphism
- Background gradient: Purple (#7b61ff) to Blue (#00c2ff)
- Glass cards dengan backdrop blur effects
- Consistent color scheme dengan proper contrast ratios
- Responsive design untuk semua device sizes

### Animasi
- Framer Motion untuk smooth transitions
- Hover effects pada interactive elements
- Loading states yang menarik
- Page transitions yang fluid

### Typography
- Inter font family
- Proper text hierarchy
- Readable contrast ratios
- Responsive text sizes

## 🚢 Deployment

### VPS Ubuntu Setup

1. **Install Dependencies**
   ```bash
   # Update system
   sudo apt update && sudo apt upgrade -y
   
   # Install Node.js
   curl -fsSL https://deb.nodesource.com/setup_18.x | sudo -E bash -
   sudo apt-get install -y nodejs
   
   # Install MongoDB
   sudo apt-get install -y mongodb
   
   # Install PM2
   sudo npm install -g pm2
   
   # Install Nginx
   sudo apt-get install -y nginx
   ```

2. **Setup Project**
   ```bash
   # Clone project
   git clone <repository-url>
   cd pusat-kendali-blogger
   
   # Install dependencies
   npm install
   cd backend && npm install && cd ..
   
   # Build frontend
   npm run build
   
   # Setup environment
   cp backend/.env.example backend/.env
   # Edit backend/.env with production values
   ```

3. **PM2 Configuration**
   
   File `backend/ecosystem.config.js` sudah tersedia:
   ```bash
   cd backend
   pm2 start ecosystem.config.js --env production
   pm2 save
   pm2 startup
   ```

4. **Nginx Configuration**
   
   Copy `backend/nginx.conf.example` ke `/etc/nginx/sites-available/blogger-dashboard`:
   ```bash
   sudo cp backend/nginx.conf.example /etc/nginx/sites-available/blogger-dashboard
   sudo ln -s /etc/nginx/sites-available/blogger-dashboard /etc/nginx/sites-enabled/
   sudo nginx -t
   sudo systemctl restart nginx
   ```

## 🔍 Troubleshooting

### Common Issues

1. **Port Already in Use**
   ```bash
   # Kill process on port 3002
   sudo lsof -t -i tcp:3002 | xargs kill -9
   
   # Or change port in backend/.env
   PORT=3003
   ```

2. **Frontend Can't Connect to Backend**
   - Pastikan backend berjalan di port 3002
   - Check `vite.config.ts` proxy configuration
   - Restart both frontend dan backend

3. **Login Failed**
   - Default credentials: admin/admin123
   - Check backend console untuk error messages
   - Pastikan JWT_SECRET di .env file

4. **OAuth Token Expired (Production)**
   - Jalankan kembali `npm run generate-token`
   - Pastikan refresh token tersimpan dengan benar

5. **Database Connection Error (Production)**
   - Periksa MongoDB service: `sudo systemctl status mongodb`
   - Periksa connection string di .env

6. **File Upload Issues**
   - Periksa permissions folder uploads
   - Pastikan ukuran file tidak melebihi limit (10MB default)

### Debug Mode

Enable debug logging:
```bash
# Backend
cd backend
DEBUG=* npm run dev

# Frontend
npm run dev -- --debug
```

## 📝 Development Workflow

### Adding New Features

1. **Frontend Component**
   ```bash
   # Create new component
   touch src/components/NewComponent.tsx
   
   # Add to routing (if needed)
   # Edit src/App.tsx
   ```

2. **Backend Endpoint**
   ```bash
   # Create controller
   touch backend/src/controllers/newController.js
   
   # Create route
   touch backend/src/routes/new.js
   
   # Add to server.js
   ```

3. **Database Model (Production)**
   ```bash
   # Create model
   touch backend/src/models/NewModel.js
   ```

### Testing

```bash
# Frontend
npm run lint
npm run build

# Backend
cd backend
npm test  # (if tests are added)
```

## 🔄 Updates & Maintenance

### Update Dependencies
```bash
# Frontend
npm update

# Backend
cd backend
npm update
```

### Backup (Production)
```bash
# Database backup
mongodump --db blogger-dashboard --out backup/

# Files backup
tar -czf backup-$(date +%Y%m%d).tar.gz uploads/ backend/.env
```

## 📞 Support & Contributing

### Getting Help
- Check troubleshooting section
- Review API documentation
- Check browser console untuk frontend errors
- Check backend logs untuk server errors

### Contributing
1. Fork repository
2. Create feature branch
3. Commit changes
4. Push to branch
5. Create Pull Request

### Reporting Issues
Include:
- Steps to reproduce
- Expected vs actual behavior
- Browser/OS information
- Console error messages
- Screenshots (if applicable)

## 📄 License

This project is licensed under the MIT License.

## 🙏 Acknowledgments

- Google Blogger API
- React Community
- Tailwind CSS Team
- Framer Motion Team
- All contributors and testers

---

**Pusat Kendali Blogger** - Mengelola blog dengan elegan dan efisien! 🚀

### Quick Start Summary

```bash
# 1. Clone & Install
git clone <repo-url> && cd pusat-kendali-blogger
npm install && cd backend && npm install && cd ..

# 2. Run Application
# Terminal 1:
cd backend && npm run dev

# Terminal 2:
npm run dev

# 3. Access
# Frontend: http://localhost:5173
# Login: admin / admin123
```

**Ready to control your Blogger! 🎮**
