# iqbalfarhan: laravel template starter v2

Starter kit **Laravel 12 + React** (Inertia v2, Tailwind v4, Shadcn UI) buat bikin project kecil lebih cepat ⚡.
Sekali generate, langsung dapet **Model + CRUD API + React View** → tinggal atur table & form aja.

---

## ✨ Fitur Utama

- 🚀 Auto generate CRUD (Model, Migration, Controller, Request, React View)
- 🔒 Role Based Access Control (RBAC) via [spatie/laravel-permission](https://spatie.be/docs/laravel-permission/v6/introduction)
- 📸 Media handling pakai [spatie/laravel-medialibrary](https://spatie.be/docs/laravel-medialibrary/v11/introduction)
- 🛠 Internal DB management dengan [laravel-adminer](https://github.com/onecentlin/laravel-adminer)
- 🎨 Sudah include Tailwind v4 + Shadcn + React + Inertia v2

---

## 🚀 Installation Steps

### 1. Create project

```bash
composer create-project iqbalfarhan/templatestarter-v2 nama_project
cd nama_project
```

> Ganti `nama_project` sesuai nama project lu.

### 2. Config awal

```bash
# Install PHP dependencies
composer install

# Install Node.js dependencies
pnpm install

# Copy env & generate key
cp .env.example .env
php artisan key:generate

# Setting database di .env lalu bikin database
# Run migrations & seeders
php artisan migrate
php artisan db:seed

# Build assets & start dev server
composer dev

# Access app at http://127.0.0.1:8000
```

### 3. File konfigurasi

Cek file `config/template-starter.php` untuk pengaturan:

- `default-roles` → default role aplikasi (`['superadmin', 'admin', 'user']`)
- `default-role` → role default user baru (misal `user`)
- `with-landingpage` → aktifkan / matiin landing page
- `generated-react-files-path` → path hasil generate file React

> ⚠️ `default-role` harus salah satu dari `default-roles`

### 4. Migrate ulang

Kalau ubah config ditengah development:

```bash
php artisan migrate:fresh --seed
```

---

## 🛠 Development Guide

### 1. Membuat Model

Gunakan command khusus:

```bash
php artisan generate:amodel NamaModel
```

Ini otomatis bikin:

- Model (dengan fillable)
- Factory & Seeder
- StoreRequest & UpdateRequest
- Controller API full method
- Route::apiResource di `web.php`

> Penting: gunakan **PascalCase** untuk nama model.

---

### 2. Membuat React View

Generate full React view dengan:

```bash
php artisan generate:rview {nama_fitur}
# contoh
php artisan generate:rview project
```

Yang dibuat:

- Index (table)
- Detail page
- Dialog delete
- Sheet create & edit
- Sheet filter
- Item component
- Type untuk model

Tambahkan menu di `app-sidebar.tsx` + route di `web.php`:

```php
Route::apiResource('project', ProjectController::class);
```

---

### 3. Generate All Sekaligus

Satu command untuk generate model + view:

```bash
php artisan generate:rmodel NamaFitur
```

Akan muncul pertanyaan:

- SoftDelete?
- Media?

Lalu input field model dalam format `field:datatype` (enter untuk baris baru):

```txt
name:string
content:text
published:boolean
published_at:datetime
category_id:fk
```

> ❌ Jangan kasih enter kosong di akhir input field

| datatype | type.d.ts | migration | description                        |
| -------- | --------- | --------- | ---------------------------------- |
| integer  | number    | integer   | angka                              |
| string   | string    | string    | varchar/string                     |
| text     | string    | text      | text panjang                       |
| date     | string    | date      | tanggal                            |
| datetime | string    | datetime  | tanggal & waktu                    |
| boolean  | boolean   | boolean   | true/false                         |
| fk       | Object    | foreignId | relasi belongsTo (wajib)           |
| nfk      | Object    | foreignId | relasi belongsTo nullable/optional |

---

### 3. Generate permission

Generate permission dengan:

```bash
php artisan generate:permission {nama_fitur}
```

Contoh:

```bash
php artisan generate:permission user
```

Akan otomatis bikin permission untuk user.

atau kalau mau lebih lazy lagi, lu bisa pake flag `--all` untuk generate semua permission dari semua model di `app/Models`:

```bash
php artisan generate:permission --all
```

ini akan otomatis bikin permission untuk semua model di `app/Models`. ini juga udah ngeceka apakah model tersebut pakai SoftDeletes atau tidak, jadi kalau pakai SoftDeletes akan otomatis bikin permission 'archived', 'restore', 'force delete' untuk soft delete.

---

## 🧭 Roadmap

- [x] Auto generate model, view, rmodel
- [x] RBAC dengan Spatie
- [ ] Login via Socialite
- [ ] Auto generate menu sidebar
- [ ] API Pagination + Search ready

---

## 💡 Tips

- Kalau ada perubahan config roles → jalankan `php artisan migrate:fresh --seed`
- Untuk dev cepat → tambahin menu di `app-sidebar.tsx` langsung setelah generate

---

## 📜 License

MIT License © [Iqbal Farhan](https://github.com/iqbalfarhan)

---

## ☕ Dukung Gue

Kalau lo merasa package ini bermanfaat, lo bisa support gue lewat donasi seikhlasnya 🙏
Donasi berapapun sangat berarti buat bantu gue terus ngembangin project ini. lu bisa klik disini :

[![Donate via Saweria](https://img.shields.io/badge/Donate-Saweria-yellow?style=for-the-badge)](https://saweria.co/iqbalfarhan08)
[![Donate via DANA](https://img.shields.io/badge/Donate-DANA-blue?style=for-the-badge)](https://link.dana.id/minta?full_url=https://qr.dana.id/v1/281012012022050160996242)

Makasih banyak sebelumnya! ❤️
