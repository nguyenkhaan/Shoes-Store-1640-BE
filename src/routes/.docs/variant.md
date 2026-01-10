# Product Variant API Documentation

## Mô tả

API quản lý các biến thể sản phẩm (size, màu sắc, số lượng) trong hệ thống.

---

## Admin Endpoints

### 1. Lấy tất cả variants

**GET** `/admin/variants`

⚠️ **Requires:** Admin authentication

#### Response Success (200)

```json
{
  "success": true,
  "message": "Get all variants successfully",
  "httpStatus": 200,
  "data": [
    {
      "id": 1,
      "quantity": 50,
      "product": {
        "id": 1,
        "name": "Nike Air Max 270"
      },
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
```

---

### 2. Tạo variant (Hỗ trợ 1 hoặc nhiều)

**POST** `/admin/variants`

⚠️ **Requires:** Admin authentication

Cổng này hỗ trợ cả tạo 1 variant lẻ hoặc tạo một mảng nhiều variants cùng lúc.

#### Request Body (Tạo mảng nhiều variants)

```json
{
  "productID": 1,
  "variants": [
    { "sizeID": 1, "colorID": 1, "quantity": 20 },
    { "sizeID": 2, "colorID": 1, "quantity": 30 }
  ]
}
```

#### Request Body (Tạo 1 variant lẻ)

```json
{
  "productID": 1,
  "sizeID": 1,
  "colorID": 1,
  "quantity": 20
}
```

#### Response Success (201)

Trả về danh sách tất cả các variants hiện có của sản phẩm đó.

```json
{
  "success": true,
  "message": "Successfully processed 2 variant(s). Created 2 new variant(s).",
  "httpStatus": 201,
  "data": [
    {
      "id": 1,
      "quantity": 20,
      "size": { "id": 1, "value": 42 },
      "color": { "id": 1, "name": "Đen", "hex": "#000000" }
    },
    {
      "id": 2,
      "quantity": 30,
      "size": { "id": 2, "value": 43 },
      "color": { "id": 1, "name": "Đen", "hex": "#000000" }
    }
  ]
}
```

---

### 3. Lấy variants theo sản phẩm

**GET** `/admin/variants/product/:productID`

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
      "quantity": 50,
      "size": { "id": 1, "value": 42 },
      "color": { "id": 1, "name": "Đen", "hex": "#000000" }
    }
  ]
}
```

---

### 4. Lấy chi tiết variant theo ID

**GET** `/admin/variants/:id`

#### Response Success (200)

```json
{
  "success": true,
  "message": "Get variant successfully",
  "httpStatus": 200,
  "data": {
    "id": 1,
    "quantity": 50,
    "product": { "id": 1, "name": "Nike Air Max 270" },
    "size": { "id": 1, "value": 42 },
    "color": { "id": 1, "name": "Đen", "hex": "#000000" }
  }
}
```

---

### 5. Cập nhật variant

**PUT** `/admin/variants/:id`

#### Request Body

Tất cả fields đều optional:

```json
{
  "sizeID": 3,
  "colorID": 2,
  "quantity": 100
}
```

#### Response Success (200)

```json
{
  "success": true,
  "message": "Variant updated successfully",
  "httpStatus": 200,
  "data": {
    "id": 1,
    "quantity": 100,
    "product": { "id": 1, "name": "Nike Air Max 270" },
    "size": { "id": 3, "value": 44 },
    "color": { "id": 2, "name": "Trắng", "hex": "#FFFFFF" }
  }
}
```

---

### 6. Xóa variant

**DELETE** `/admin/variants/:id`

#### Response Success (200)

```json
{
  "success": true,
  "message": "Variant deleted successfully",
  "httpStatus": 200
}
```

#### Response Error (400)

```json
{
  "success": false,
  "message": "Cannot delete variant that has been ordered",
  "httpStatus": 400
}
```

---

## Error Codes

| HTTP Status | Mô tả                                                                             |
| ----------- | --------------------------------------------------------------------------------- |
| 200         | Success                                                                           |
| 201         | Created successfully                                                              |
| 400         | Bad Request (Dữ liệu không hợp lệ, variant đã tồn tại, hoặc đã có trong đơn hàng) |
| 404         | Not Found (Không tìm thấy product, size, color hoặc variant)                      |
| 500         | Internal Server Error                                                             |
