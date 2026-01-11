# 👟 WEBSITE BÁN GIÀY – BACKEND SERVICE

![ExpressJS](https://img.shields.io/badge/ExpressJS-000000?style=for-the-badge&logo=express&logoColor=white)
![TypeScript](https://img.shields.io/badge/TypeScript-007ACC?style=for-the-badge&logo=typescript&logoColor=white)
![Docker](https://img.shields.io/badge/Docker-2496ED?style=for-the-badge&logo=docker&logoColor=white)
![Prisma](https://img.shields.io/badge/Prisma-2D3748?style=for-the-badge&logo=prisma&logoColor=white)
![MySQL](https://img.shields.io/badge/MySQL-4479A1?style=for-the-badge&logo=mysql&logoColor=white)

---

## 📌 Giới thiệu
Đây là **Backend Service** cho dự án **Website Bán Giày**, được xây dựng theo mô hình **REST API**, sử dụng **Docker** để quản lý database và **Prisma ORM** để thao tác dữ liệu. 
---

## 🚀 Công nghệ sử dụng
- **Node.js**
- **ExpressJS**
- **TypeScript**
- **Docker & Docker Compose**
- **Prisma ORM**

---

## 🛠 Hướng dẫn chạy dự án

### 1️⃣ Yêu cầu môi trường
- Đã cài đặt **Docker**
- **Node.js >= 18**

👉 Tải Docker tại:  
https://www.docker.com/

---

### 2️⃣ Khởi động Database bằng Docker

#### Bước 1: Cấu hình môi trường
- Cập nhật file `.env` tại thư mục **root**
- Kiểm tra / chỉnh sửa file `init.sql` để:
  - Tạo database
  - Tạo user
  - Phân quyền truy cập database

#### Bước 2: Chạy Docker
Mở Terminal tại thư mục root của project và chạy:

```bash
docker compose up -d
```

#### Bước 3: Kiểm tra database
- Mở trình duyệt và truy cập:
```
http://localhost:8080
```
- Đăng nhập **phpMyAdmin** bằng tài khoản trong file `.env`

> ⚠️ **Lưu ý quan trọng**  
> Trước khi chạy Docker, hãy **tắt toàn bộ service đang chiếm port 3306** trên máy (MySQL, MariaDB, SQL Server…) để tránh xung đột.

Nếu gặp lỗi Docker:
```bash
docker compose down
docker compose up -d
```

---

## ▶️ Chạy Backend

### 🔰 Lần đầu clone project
Chạy lệnh sau:

```bash
npm run setup
```

Lệnh này sẽ:
- Cài đặt dependencies
- Generate Prisma Client
- Chuẩn bị môi trường cho server

---

### ▶️ Chạy server
```bash
npm run start
```

Nếu Terminal hiển thị:
```
Server khoi dong thanh cong o port: 6869
```
→ Backend đã chạy thành công ✅

---

## 🧬 Prisma Commands (Hạn chế sử dụng)

| Lệnh | Mô tả |
|----|----|
| `npx prisma init` | Khởi tạo Prisma |
| `npx prisma migrate dev --name init` | Đồng bộ schema + tạo migration |
| `npx prisma db push` | Đồng bộ schema nhanh (không tạo migration) |
| `npx prisma migrate reset` | Reset database |
| `npx prisma generate` | Generate Prisma Client |
| `npx prisma db seed` | Generate Prisma Client |

> ⚠️ **Không tự ý chạy migration / reset**

---

## 📂 Cấu trúc thư mục (Tổng quát)

```text
root/
├── prisma/
├── src/
│   ├── controllers/
│   ├── services/
│   ├── routes/
│   ├── middlewares/
│   └── routes/
│   └── types/
│   └── utils/
├── docker-compose.yml
├── init.sql
├── .env
└── README.md
```

