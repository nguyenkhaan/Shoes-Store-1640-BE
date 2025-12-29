# DỰ ÁN: WEBSITE BÁN GIÀY 
## 1. Hướng dẫn chạy dự án 
### 1.1. Khởi động docker 
- Tải và tiến hành cài đặt Docker về laptop 
https://www.docker.com/

- Cập nhật file .env và init.sql ở thư mục root để lấy tài khoản + tên DB + quyền hạn cho tài khoản. 

- Mở dự án ở thư mục root. Chạy lệnh docker compose up -d trong Terminal để tiến hành khởi tạo các containers và images. 

- Kiểm tra docker đã chạy thành công chưa: Mở trình duyệt (Firefox, Google...) và truy cập đường link: http://localhost:8080 để vào trang phpmyadmin do Docker khởi tạo. Đăng nhập bằng tài khoản và mật khẩu được cung cấp trong file .env. 

- Nếu lỗi thì xóa hết containers và chạy lại 

*Chú ý*: Trước khi chạy lệnh docker compose up -d phải tắt hết tất cả các services chạy ở port 3306 (VD: Maridb, MySQL, SQLServer) trên laptop, nhường port 3306 cho Docker. 

### 1.2. Chạy dự án 
npm init i

npm run start 

- Server hiện dòng thông báo Khởi động thành công là ổn 

### 1.3. Các lệnh cập nhật prisma (Hạn chế đụng) 
- npm run prisma:init = npx prisma init
- npm run prisma:migration: Đồng bộ schema với database (có tạo file migration)
- npm run prisma:push: Đồng bộ nhanh (Không tạo ra file migration trong project)
- npm run prisma:reset: 
- npm run prisma:generate: Tạo folder generate để thao tác với database thông qua ORM Syntax