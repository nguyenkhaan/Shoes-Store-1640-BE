# Order API Documentation

## Mô tả

API quản lý đơn hàng trong hệ thống cửa hàng giày. Bao gồm các endpoint cho người dùng (đặt hàng, xem đơn, hủy đơn) và quản trị viên (quản lý đơn hàng, cập nhật trạng thái).

---

## User Endpoints

### 1. Tạo đơn hàng mới

**POST** `/orders`

⚠️ **Requires:** User authentication

Tạo đơn hàng mới với danh sách sản phẩm và thông tin thanh toán.

#### Request Body

```json
{
  "shippingAddress": "123 Nguyễn Văn A, Q.1, TP.HCM",
  "paymentMethod": "COD",
  "items": [
    {
      "productVariantID": 1,
      "quantity": 2
    },
    {
      "productVariantID": 3,
      "quantity": 1
    }
  ]
}
```

#### Required Fields

- `shippingAddress` (string) - Địa chỉ giao hàng
- `paymentMethod` (string) - Phương thức thanh toán: `COD` hoặc `credit_card`
- `items` (array) - Danh sách sản phẩm
  - `productVariantID` (number) - ID của variant sản phẩm
  - `quantity` (number) - Số lượng

#### Response Success (201)

```json
{
  "success": true,
  "message": "Order created successfully",
  "httpStatus": 201,
  "data": {
    "id": 1,
    "status": "pending",
    "shippingAddress": "123 Nguyễn Văn A, Q.1, TP.HCM",
    "createdAt": "2026-01-10T09:00:00.000Z",
    "payments": {
      "id": 1,
      "paymentMethod": "COD"
    },
    "orderItems": [
      {
        "id": 1,
        "quantity": 2,
        "price": "2500000",
        "productVariant": {
          "id": 1,
          "product": {
            "id": 1,
            "name": "Nike Air Max 270",
            "thumbnail": "https://example.com/image.jpg"
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
      }
    ]
  }
}
```

#### Response Error (400) - Thiếu tồn kho

```json
{
  "success": false,
  "message": "Insufficient stock for variant ID 1. Available: 5",
  "httpStatus": 400
}
```

#### Response Error (404) - Variant không tồn tại

```json
{
  "success": false,
  "message": "One or more product variants not found",
  "httpStatus": 404
}
```

---

### 2. Lấy danh sách đơn hàng của tôi

**GET** `/orders`

⚠️ **Requires:** User authentication

Lấy tất cả đơn hàng của user đang đăng nhập.

#### Response Success (200)

```json
{
  "success": true,
  "message": "Get orders successfully",
  "httpStatus": 200,
  "data": [
    {
      "id": 1,
      "status": "pending",
      "shippingAddress": "123 Nguyễn Văn A, Q.1, TP.HCM",
      "createdAt": "2026-01-10T09:00:00.000Z",
      "payments": {
        "id": 1,
        "paymentMethod": "COD"
      },
      "orderItems": [...]
    }
  ]
}
```

---

### 3. Xem chi tiết đơn hàng

**GET** `/orders/:id`

⚠️ **Requires:** User authentication

User chỉ có thể xem đơn hàng của chính mình.

#### Parameters

- `id` (number) - ID của đơn hàng

#### Response Success (200)

```json
{
  "success": true,
  "message": "Get order successfully",
  "httpStatus": 200,
  "data": {
    "id": 1,
    "status": "pending",
    "shippingAddress": "123 Nguyễn Văn A, Q.1, TP.HCM",
    "createdAt": "2026-01-10T09:00:00.000Z",
    "user": {
      "id": 1,
      "name": "Nguyễn Văn A",
      "email": "user@example.com",
      "phone": "0901234567"
    },
    "payments": {...},
    "orderItems": [...]
  }
}
```

#### Response Error (404)

```json
{
  "success": false,
  "message": "Order not found",
  "httpStatus": 404
}
```

---

### 4. Hủy đơn hàng

**PUT** `/orders/:id/cancel`

⚠️ **Requires:** User authentication

Hủy đơn hàng. Chỉ có thể hủy đơn hàng có trạng thái `pending`.

#### Parameters

- `id` (number) - ID của đơn hàng cần hủy

#### Response Success (200)

```json
{
  "success": true,
  "message": "Order cancelled successfully",
  "httpStatus": 200
}
```

#### Response Error (400) - Không thể hủy

```json
{
  "success": false,
  "message": "Can only cancel orders with pending status",
  "httpStatus": 400
}
```

---

### 5. Cập nhật địa chỉ nhận hàng

**PATCH** `/orders/:id/address`

⚠️ **Requires:** User authentication

Thay đổi địa chỉ giao hàng. Chỉ có thể thực hiện khi đơn hàng đang ở trạng thái `pending`.

#### Parameters

- `id` (number) - ID của đơn hàng cần cập nhật

#### Request Body

```json
{
  "shippingAddress": "456 Lê Lợi, Q.1, TP.HCM"
}
```

#### Response Success (200)

```json
{
  "success": true,
  "message": "Shipping address updated successfully",
  "httpStatus": 200,
  "data": {
    "id": 1,
    "shippingAddress": "456 Lê Lợi, Q.1, TP.HCM",
    "status": "pending"
  }
}
```

#### Response Error (400) - Trạng thái không hợp lệ

```json
{
  "success": false,
  "message": "Can only update shipping address for orders with pending status",
  "httpStatus": 400
}
```

---

## Admin Endpoints

### 6. Lấy tất cả đơn hàng

**GET** `/admin/orders`

⚠️ **Requires:** Admin authentication

Lấy danh sách tất cả đơn hàng trong hệ thống.

#### Response Success (200)

```json
{
  "success": true,
  "message": "Get all orders successfully",
  "httpStatus": 200,
  "data": [
    {
      "id": 1,
      "status": "pending",
      "shippingAddress": "...",
      "createdAt": "...",
      "user": {
        "id": 1,
        "name": "Nguyễn Văn A",
        "email": "user@example.com",
        "phone": "0901234567"
      },
      "payments": {...},
      "orderItems": [...]
    }
  ]
}
```

---

### 7. Xem chi tiết đơn hàng (Admin)

**GET** `/admin/orders/:id`

⚠️ **Requires:** Admin authentication

Admin có thể xem chi tiết bất kỳ đơn hàng nào.

#### Parameters

- `id` (number) - ID của đơn hàng

---

### 8. Cập nhật trạng thái đơn hàng

**PUT** `/admin/orders/:id/status`

⚠️ **Requires:** Admin authentication

#### Parameters

- `id` (number) - ID của đơn hàng

#### Request Body

```json
{
  "status": "confirmed"
}
```

#### Valid Status Values

| Status      | Mô tả                      |
| ----------- | -------------------------- |
| `pending`   | Đơn hàng mới, chờ xác nhận |
| `confirmed` | Đã xác nhận, đang chuẩn bị |
| `shipping`  | Đang giao hàng             |
| `delivered` | Đã giao thành công         |
| `cancelled` | Đã hủy                     |

#### Response Success (200)

```json
{
  "success": true,
  "message": "Order status updated successfully",
  "httpStatus": 200,
  "data": {
    "id": 1,
    "status": "confirmed",
    "shippingAddress": "...",
    "createdAt": "..."
  }
}
```

#### Response Error (400)

```json
{
  "success": false,
  "message": "Invalid status. Must be one of: pending, confirmed, shipping, delivered, cancelled",
  "httpStatus": 400
}
```

---

## Order Status Flow

```
pending → confirmed → shipping → delivered
    ↓
cancelled (chỉ từ pending)
```

---

## Payment Methods

| Method        | Mô tả                                       |
| ------------- | ------------------------------------------- |
| `COD`         | Thanh toán khi nhận hàng (Cash on Delivery) |
| `credit_card` | Thanh toán bằng thẻ tín dụng                |

---

## Database Schema

```prisma
model Order {
  id              Int         @id @default(autoincrement())
  user            User        @relation(fields: [userID], references: [id])
  userID          Int
  status          String      // pending, confirmed, shipping, delivered, cancelled
  orderItems      OrderItem[]
  shippingAddress String
  createdAt       DateTime
  payments        Payment?
}

model Payment {
  id            Int    @id @default(autoincrement())
  paymentMethod String // COD, credit_card
  order         Order  @relation(fields: [orderID], references: [id])
  orderID       Int    @unique
}

model OrderItem {
  id               Int            @id @default(autoincrement())
  quantity         Int
  price            Decimal
  productVariant   ProductVariant @relation(fields: [productVariantID], references: [id])
  productVariantID Int
  order            Order          @relation(fields: [orderID], references: [id])
  orderID          Int
}
```

---

## Error Codes

| HTTP Status | Mô tả                                                             |
| ----------- | ----------------------------------------------------------------- |
| 200         | Success                                                           |
| 201         | Created successfully                                              |
| 400         | Bad Request (thiếu fields, không đủ tồn kho, status không hợp lệ) |
| 401         | Unauthorized (chưa đăng nhập)                                     |
| 403         | Forbidden (không có quyền)                                        |
| 404         | Not Found (không tìm thấy đơn hàng/variant)                       |
| 500         | Internal Server Error                                             |

---

## Ghi chú

1. **Tồn kho:**
   - Khi tạo đơn hàng: số lượng tồn kho sẽ bị trừ
   - Khi hủy đơn hàng: số lượng tồn kho sẽ được hoàn lại

2. **Snapshot giá:**
   - Giá trong OrderItem được lưu tại thời điểm đặt hàng
   - Nếu giá sản phẩm thay đổi sau đó, đơn hàng không bị ảnh hưởng

3. **Hủy đơn:**
   - Chỉ user tạo đơn mới có thể hủy
   - Chỉ hủy được khi status = `pending`
   - Admin có thể đổi status thành `cancelled` ở bất kỳ thời điểm nào

4. **Authentication:**
   - User endpoints yêu cầu token JWT hợp lệ
   - Admin endpoints yêu cầu role Admin

---

## Examples

### Tạo đơn hàng mới

```bash
curl -X POST http://localhost:6869/api/orders \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer YOUR_TOKEN" \
  -d '{
    "shippingAddress": "123 Nguyễn Văn A, Q.1, TP.HCM",
    "paymentMethod": "COD",
    "items": [
      { "productVariantID": 1, "quantity": 2 },
      { "productVariantID": 3, "quantity": 1 }
    ]
  }'
```

### Hủy đơn hàng

```bash
curl -X PUT http://localhost:6869/api/orders/1/cancel \
  -H "Authorization: Bearer YOUR_TOKEN"
```

### Admin cập nhật trạng thái

```bash
curl -X PUT http://localhost:6869/api/admin/orders/1/status \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer ADMIN_TOKEN" \
  -d '{ "status": "shipping" }'
```
