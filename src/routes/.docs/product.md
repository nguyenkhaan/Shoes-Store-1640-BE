# Product API Documentation

## Mô tả

API quản lý sản phẩm trong hệ thống cửa hàng giày. Bao gồm các endpoint cho cả người dùng (public) và quản trị viên (admin).

---

## Public Endpoints

### 1. Lấy danh sách sản phẩm

**GET** `/products`

Lấy danh sách tất cả sản phẩm đang active (hiển thị cho người dùng).

#### Response Success (200)

```json
{
  "success": true,
  "message": "Get all products successfully",
  "httpStatus": 200,
  "data": [
    {
      "id": 1,
      "name": "Nike Air Max 270",
      "description": "Giày thể thao nam cao cấp",
      "price": "2500000",
      "active": true,
      "thumbnail": "cloudinary_public_id",
      "brand": {
        "id": 1,
        "name": "Nike"
      },
      "productVariants": [
        {
          "id": 1,
          "quantity": 10,
          "size": {
            "id": 1,
            "value": 42
          },
          "color": {
            "id": 1,
            "name": "Đen",
            "hex": "#000000"
          }
        }
      ]
    }
  ]
}
```

---

### 2. Lấy chi tiết sản phẩm theo ID

**GET** `/products/:id`

#### Parameters

- `id` (number) - ID của sản phẩm

#### Response Success (200)

```json
{
  "success": true,
  "message": "Get product successfully",
  "httpStatus": 200,
  "data": {
    "id": 1,
    "name": "Nike Air Max 270",
    "description": "Giày thể thao nam cao cấp",
    "price": "2500000",
    "active": true,
    "thumbnail": "cloudinary_public_id",
    "brand": {
      "id": 1,
      "name": "Nike"
    },
    "productVariants": [...]
  }
}
```

---

### 3. Tìm kiếm sản phẩm

**GET** `/products/search?query={keyword}`

#### Query Parameters

- `query` (string) - Từ khóa tìm kiếm trong tên hoặc mô tả sản phẩm

---

### 4. Lấy sản phẩm theo thương hiệu

**GET** `/products/brand/:brandID`

#### Parameters

- `brandID` (number) - ID của thương hiệu

---

## Admin Endpoints

### 5. Lấy tất cả sản phẩm (kể cả inactive)

**GET** `/admin/products`

⚠️ **Requires:** Admin authentication

---

### 6. Tạo sản phẩm mới

**POST** `/admin/products`

⚠️ **Requires:** Admin authentication

Cổng này hỗ trợ cả `application/json` và `multipart/form-data` (để upload ảnh).

#### Request Body / Form Data

- `name` (string, required) - Tên sản phẩm
- `description` (string, required) - Mô tả sản phẩm
- `price` (number/string, required) - Giá sản phẩm
- `active` (boolean/string, required) - "true"/"false" hoặc true/false
- `brandID` (number/string, required) - ID thương hiệu
- `thumbnail` (file, optional) - File ảnh tải lên qua field `thumbnail`
- `thumbnail` (string, optional) - Nếu không upload file, có thể gửi public_id hoặc URL ảnh.

#### Response Success (201)

```json
{
  "success": true,
  "message": "Product created successfully",
  "httpStatus": 201,
  "data": {
    "id": 1,
    "name": "Nike Air Max 270",
    ...
    "brand": {
      "id": 1,
      "name": "Nike"
    }
  }
}
```

---

### 7. Cập nhật sản phẩm

**PUT** `/admin/products/:id`

⚠️ **Requires:** Admin authentication

Tương tự tạo mới, hỗ trợ update từng field và upload ảnh mới qua field `thumbnail`.

---

### 8. Xóa sản phẩm

**DELETE** `/admin/products/:id`

⚠️ **Requires:** Admin authentication

Khi xóa sản phẩm, hệ thống sẽ **tự động xóa tất cả các variants** liên quan trong một transaction.

---

## Database Schema

```prisma
model Product {
  id              Int              @id @default(autoincrement())
  name            String
  description     String
  price           Decimal
  active          Boolean
  thumbnail       String           @default("https://static.thenounproject.com/png/5191452-200.png")
  brand           Brand            @relation(fields: [brandID], references: [id])
  brandID         Int
  productVariants ProductVariant[]
}
```

---

## Ghi chú quan trọng

1. **Dữ liệu trả về (Optimization):**
   - Đã loại bỏ các trường ID dư thừa như `brandID`, `productID`, `sizeID`, `colorID` khỏi response.
   - Thông tin chi tiết được lồng trong các object `brand`, `size`, `color`.

2. **Xử lý Ảnh:**
   - Ảnh được upload lên Cloudinary. Trường `thumbnail` trong DB sẽ lưu `public_id` hoặc URL ảnh.

3. **Xóa Sản phẩm:**
   - Không cần phải xóa variant thủ công trước khi xóa product. Hệ thống đã xử lý tự động.

4. **Validation:**
   - `brandID` phải tồn tại. Nếu không sẽ trả về lỗi 404 Brand not found.
   - `id` trong URL phải là số nguyên.
