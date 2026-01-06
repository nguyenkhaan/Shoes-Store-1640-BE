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
      "thumbnail": "https://example.com/image.jpg",
      "brandID": 1,
      "brand": {
        "id": 1,
        "name": "Nike"
      },
      "productVariants": [
        {
          "id": 1,
          "productID": 1,
          "sizeID": 1,
          "colorID": 1,
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
    "thumbnail": "https://example.com/image.jpg",
    "brandID": 1,
    "brand": {
      "id": 1,
      "name": "Nike"
    },
    "productVariants": [...]
  }
}
```

#### Response Error (404)

```json
{
  "success": false,
  "message": "Product not found",
  "httpStatus": 404
}
```

---

### 3. Tìm kiếm sản phẩm

**GET** `/products/search?query={keyword}`

#### Query Parameters

- `query` (string) - Từ khóa tìm kiếm trong tên hoặc mô tả sản phẩm

#### Example

```
GET /products/search?query=nike
```

#### Response Success (200)

```json
{
  "success": true,
  "message": "Search completed successfully",
  "httpStatus": 200,
  "data": [...]
}
```

#### Response Error (400)

```json
{
  "success": false,
  "message": "Missing or invalid query parameter",
  "httpStatus": 400
}
```

---

### 4. Lấy sản phẩm theo thương hiệu

**GET** `/products/brand/:brandID`

#### Parameters

- `brandID` (number) - ID của thương hiệu

#### Example

```
GET /products/brand/1
```

#### Response Success (200)

```json
{
  "success": true,
  "message": "Get products by brand successfully",
  "httpStatus": 200,
  "data": [...]
}
```

---

## Admin Endpoints

### 5. Lấy tất cả sản phẩm (kể cả inactive)

**GET** `/admin/products`

⚠️ **Requires:** Admin authentication

Lấy danh sách tất cả sản phẩm kể cả những sản phẩm đã bị ẩn (inactive).

#### Response Success (200)

```json
{
  "success": true,
  "message": "Get all products successfully",
  "httpStatus": 200,
  "data": [...]
}
```

---

### 6. Tạo sản phẩm mới

**POST** `/admin/products`

⚠️ **Requires:** Admin authentication

#### Request Body

```json
{
  "name": "Nike Air Max 270",
  "description": "Giày thể thao nam cao cấp",
  "price": 2500000,
  "active": true,
  "thumbnail": "https://example.com/image.jpg",
  "brandID": 1
}
```

#### Required Fields

- `name` (string) - Tên sản phẩm
- `description` (string) - Mô tả sản phẩm
- `price` (number) - Giá sản phẩm
- `active` (boolean) - Trạng thái hiển thị
- `brandID` (number) - ID thương hiệu

#### Optional Fields

- `thumbnail` (string) - Link ảnh đại diện (có giá trị mặc định)

#### Response Success (201)

```json
{
  "success": true,
  "message": "Product created successfully",
  "httpStatus": 201,
  "data": {
    "id": 1,
    "name": "Nike Air Max 270",
    "description": "Giày thể thao nam cao cấp",
    "price": "2500000",
    "active": true,
    "thumbnail": "https://example.com/image.jpg",
    "brandID": 1,
    "brand": {
      "id": 1,
      "name": "Nike"
    }
  }
}
```

#### Response Error (404)

```json
{
  "success": false,
  "message": "Brand not found",
  "httpStatus": 404
}
```

#### Response Error (400)

```json
{
  "success": false,
  "message": "Missing required fields: name, description, price, active, brandID",
  "httpStatus": 400
}
```

---

### 7. Cập nhật sản phẩm

**PUT** `/admin/products/:id`

⚠️ **Requires:** Admin authentication

#### Parameters

- `id` (number) - ID của sản phẩm cần cập nhật

#### Request Body

Tất cả các trường đều optional, chỉ gửi những trường cần update:

```json
{
  "name": "Nike Air Max 270 Updated",
  "description": "Mô tả mới",
  "price": 2800000,
  "active": false,
  "thumbnail": "https://example.com/new-image.jpg",
  "brandID": 2
}
```

#### Response Success (200)

```json
{
  "success": true,
  "message": "Product updated successfully",
  "httpStatus": 200,
  "data": {
    "id": 1,
    "name": "Nike Air Max 270 Updated",
    ...
  }
}
```

#### Response Error (404)

```json
{
  "success": false,
  "message": "Product not found",
  "httpStatus": 404
}
```

---

### 8. Xóa sản phẩm

**DELETE** `/admin/products/:id`

⚠️ **Requires:** Admin authentication

#### Parameters

- `id` (number) - ID của sản phẩm cần xóa

#### Response Success (200)

```json
{
  "success": true,
  "message": "Product deleted successfully",
  "httpStatus": 200
}
```

#### Response Error (404)

```json
{
  "success": false,
  "message": "Product not found",
  "httpStatus": 404
}
```

#### Response Error (400)

```json
{
  "success": false,
  "message": "Cannot delete product with existing variants. Please delete all variants first.",
  "httpStatus": 400
}
```

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

## Error Codes

| HTTP Status | Mô tả                                            |
| ----------- | ------------------------------------------------ |
| 200         | Success                                          |
| 201         | Created successfully                             |
| 400         | Bad Request (thiếu fields, dữ liệu không hợp lệ) |
| 404         | Not Found (không tìm thấy sản phẩm/brand)        |
| 500         | Internal Server Error                            |

---

## Ghi chú

1. **Validation:**
   - ID phải là số nguyên
   - Price có thể là number hoặc string, sẽ được convert sang Decimal
   - BrandID phải tồn tại trong database

2. **Relations:**
   - Mỗi Product phải thuộc về 1 Brand
   - Product có thể có nhiều ProductVariant (size, color khác nhau)
   - Không thể xóa Product nếu còn ProductVariant liên quan

3. **Public vs Admin:**
   - Public endpoints chỉ trả về sản phẩm `active: true`
   - Admin endpoints trả về tất cả sản phẩm

4. **Thumbnail:**
   - Nếu không cung cấp, sẽ dùng ảnh mặc định
   - Nên lưu URL đầy đủ (http/https)

---

## Examples

### Tạo sản phẩm mới

```bash
curl -X POST http://localhost:6869/admin/products \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer YOUR_TOKEN" \
  -d '{
    "name": "Adidas Ultraboost 22",
    "description": "Giày chạy bộ cao cấp",
    "price": 3200000,
    "active": true,
    "brandID": 2
  }'
```

### Tìm kiếm sản phẩm

```bash
curl http://localhost:6869/products/search?query=nike
```

### Cập nhật trạng thái sản phẩm

```bash
curl -X PUT http://localhost:6869/admin/products/1 \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer YOUR_TOKEN" \
  -d '{
    "active": false
  }'
```

---

## Product Variant API

### Tạo variant đơn lẻ

**POST** `/api/admin/variants`

⚠️ **Requires:** Admin authentication

#### Request Body

```json
{
  "productID": 1,
  "sizeID": 2,
  "colorID": 1,
  "quantity": 50
}
```

#### Response Success (201)

```json
{
  "success": true,
  "message": "Product variant created successfully",
  "httpStatus": 201,
  "data": {
    "id": 1,
    "productID": 1,
    "sizeID": 2,
    "colorID": 1,
    "quantity": 50,
    "product": {...},
    "size": { "id": 2, "value": 42 },
    "color": { "id": 1, "name": "Đen", "hex": "#000000" }
  }
}
```

---

### Tạo nhiều variants cùng lúc

**POST** `/api/admin/variants/bulk`

⚠️ **Requires:** Admin authentication

Tạo nhiều variants cho 1 sản phẩm (ví dụ: tất cả size/color combinations)

#### Request Body

```json
{
  "productID": 1,
  "variants": [
    { "sizeID": 1, "colorID": 1, "quantity": 20 },
    { "sizeID": 2, "colorID": 1, "quantity": 30 },
    { "sizeID": 1, "colorID": 2, "quantity": 15 }
  ]
}
```

#### Response Success (201)

```json
{
  "success": true,
  "message": "Created 3 variants successfully",
  "httpStatus": 201,
  "data": [...]
}
```

---

### Lấy variants theo sản phẩm

**GET** `/api/admin/variants/product/:productID`

#### Parameters

- `productID` (number) - ID của sản phẩm

#### Response Success (200)

```json
{
  "success": true,
  "message": "Get variants successfully",
  "httpStatus": 200,
  "data": [
    {
      "id": 1,
      "productID": 1,
      "sizeID": 2,
      "colorID": 1,
      "quantity": 50,
      "size": { "id": 2, "value": 42 },
      "color": { "id": 1, "name": "Đen", "hex": "#000000" }
    }
  ]
}
```

---

### Lấy variant theo ID

**GET** `/api/admin/variants/:id`

#### Response Success (200)

```json
{
  "success": true,
  "message": "Get variant successfully",
  "httpStatus": 200,
  "data": {...}
}
```

---

### Cập nhật variant

**PUT** `/api/admin/variants/:id`

#### Request Body

Tất cả fields đều optional:

```json
{
  "sizeID": 3,
  "colorID": 2,
  "quantity": 100
}
```

---

### Xóa variant

**DELETE** `/api/admin/variants/:id`

#### Response Error (400)

```json
{
  "success": false,
  "message": "Cannot delete variant that has been ordered",
  "httpStatus": 400
}
```
