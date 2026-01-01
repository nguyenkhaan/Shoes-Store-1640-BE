# API Documentation

## Authentication APIs

| API | Method | Middleware can thiet | Request | Response |
| :--- | :--- | :--- | :--- | :--- |
| `/api/auth/register` | `POST` | `requireFields(["name", "email", "password", "phone", "address"])` | ```json { "name": "string", "email": "string", "password": "string", "phone": "string", "address": "string" } ``` | **Success (200):** ```json { "message": "Register successfully. Please check your email for verify", "success": true, "token": "string" } ``` <br> **Error (400/409/500):** ```json { "success": false, "message": "string" } ``` |
| `/api/auth/verify` | `GET` | - | **Query Parameter:** `token` <br> Example: `/api/auth/verify?token=your_jwt_token`| **Success (201):** ```json { "message": "Your email has been verified successfully", "success": true } ``` <br> **Error (400/401/500):** ```json { "success": false, "message": "string" } ``` |
| `/api/auth/login` | `POST` | `requireFields(["email", "password"])`, `checkUserStatusByEmail` | ```json { "email": "string", "password": "string" } ``` | **Success (200):** ```json { "success": true, "message": "Login successfully", "accessToken": "string", "refreshToken": "string" } ``` <br> **Error (401/500):** ```json { "success": false, "message": "string" } ``` |

## Products API

| API | Method | Middlewares | Request | Response |
| :--- | :--- | :--- | :--- | :--- |
| `GET /api/products` | `GET` | - | **Query Params (Optional):**<br>- `search` (string): Search by product name.<br>- `category` (int): Filter by category ID.<br>- `brand` (int): Filter by brand ID.<br>- `page` (int): Page number for pagination.<br>- `limit` (int): Number of items per page. | **Success (200):**<br>```json{  "success": true,  "data": {    "products": [      {        "id": 1,        "name": "Giày Nike Air Force 1",        "price": 2500000,        "thumbnail": "url_to_image"      }    ],    "pagination": {      "page": 1,      "limit": 10,      "total": 50    }  }}``` |
| `GET /api/products/:id` | `GET` | - | **URL Parameter:**<br>- `id` (int): The ID of the product. | **Success (200):**<br>```json{  "success": true,  "data": {    "id": 1,    "name": "Giày Nike Air Force 1",    "description": "Mô tả chi tiết sản phẩm.",    "price": 2500000,    "thumbnail": "url_to_image",    "brand": { "id": 1, "name": "Nike" },    "category": { "id": 2, "description": "Giày thể thao" },    "variants": [      {        "id": 101,        "size": { "id": 3, "name": "42" },        "color": { "id": 1, "name": "Trắng", "hex": "#FFFFFF" },        "quantity": 20      }    ]  }}```<br>**Error (404):**<br>```json{ "success": false, "message": "Product not found" }``` |

## Cart API

| API | Method | Middlewares | Request | Response |
| :--- | :--- | :--- | :--- | :--- |
| `GET /api/cart` | `GET` | `credentials` | - | **Success (200):**<br>```json{  "success": true,  "data": {    "items": [      {        "productVariantID": 101,        "productName": "Giày Nike Air Force 1",        "size": "42",        "color": "Trắng",        "quantity": 2,        "price": 2500000,        "thumbnail": "url_to_image"      }    ],    "total": 5000000  }}``` |
| `POST /api/cart/items` | `POST` | `credentials` | **Body:**<br>```json{  "productVariantID": 102,  "quantity": 1}``` | **Success (200):**<br>```json{  "success": true,  "message": "Product added to cart",  "data": { /* a cart object */ }}```<br>**Error (400/401/404):**<br>```json{ "success": false, "message": "Error message" }``` |
| `PUT /api/cart/items/:productVariantID` | `PUT` | `credentials` | **URL Parameter:**<br>- `productVariantID` (int): The ID of the product variant.<br>**Body:**<br>```json{ "quantity": 3 }``` | **Success (200):**<br>```json{  "success": true,  "message": "Cart updated",  "data": { /* a cart object */ }}```<br>**Error (400/401/404):**<br>```json{ "success": false, "message": "Error message" }``` |
| `DELETE /api/cart/items/:productVariantID` | `DELETE` | `credentials` | **URL Parameter:**<br>- `productVariantID` (int): The ID of the product variant. | **Success (200):**<br>```json{  "success": true,  "message": "Item removed from cart",  "data": { /* a cart object */ }}```<br>**Error (401/404):**<br>```json{ "success": false, "message": "Error message" }``` |

## User API

| API | Method | Middlewares | Request | Response |
| :--- | :--- | :--- | :--- | :--- |
| `GET /api/user/profile` | `GET` | `credentials` | - | **Success (200):**<br>```json{  "success": true,  "data": {    "id": 123,    "name": "Nguyen Van A",    "email": "a@example.com",    "phone": "0987654321",    "address": "123 Đường ABC, Quận XYZ, TP HCM",    "avatar": "url_to_avatar"  }}```<br>**Error (401):**<br>```json{ "success": false, "message": "Unauthorized" }``` |
| `PUT /api/user/profile` | `PUT` | `credentials` | **Body:**<br>```json{  "name": "Nguyen Van B",  "phone": "0123456789",  "address": "456 Đường DEF, Quận UVW, TP HCM",  "avatar": "url_to_new_avatar"}``` | **Success (200):**<br>```json{  "success": true,  "message": "Profile updated successfully",  "data": { /* an updated user profile object */ }}```<br>**Error (400/401):**<br>```json{ "success": false, "message": "Error message" }``` |
| `GET /api/user/orders` | `GET` | `credentials` | **Query Params (Optional):**<br>- `page` (int)<br>- `limit` (int) | **Success (200):**<br>```json{  "success": true,  "data": {    "orders": [      {        "id": 1,        "status": "Delivered",        "createdAt": "2023-10-27T10:00:00Z",        "total": 5000000      }    ],    "pagination": { /* pagination object */ }  }}```<br>**Error (401):**<br>```json{ "success": false, "message": "Unauthorized" }``` |

## Order API

| API | Method | Middlewares | Request | Response |
| :--- | :--- | :--- | :--- | :--- |
| `POST /api/orders` | `POST` | `credentials` | **Body:**<br>```json{  "shippingAddress": "789 Đường GHI, Quận MNO, TP HCM",  "paymentMethod": "Credit Card"}``` | **Success (201):**<br>```json{  "success": true,  "message": "Order created successfully",  "data": {    "orderId": 567,    "status": "Pending",    "total": 5000000  }}```<br>**Error (400/401):**<br>```json{ "success": false, "message": "Error message (e.g., Cart is empty)" }``` |
| `GET /api/orders/:id` | `GET` | `credentials` | **URL Parameter:**<br>- `id` (int): The ID of the order. | **Success (200):**<br>```json{  "success": true,  "data": {    "id": 567,    "status": "Pending",    "shippingAddress": "789 Đường GHI, Quận MNO, TP HCM",    "createdAt": "2023-10-28T11:00:00Z",    "payment": { "paymentMethod": "Credit Card" },    "items": [      {        "productName": "Giày Nike Air Force 1",        "quantity": 2,        "price": 2500000      }    ],    "total": 5000000  }}```<br>**Error (401/404):**<br>```json{ "success": false, "message": "Error message" }``` |

## Admin API

### Product Management

| API | Method | Middlewares | Request | Response |
| :--- | :--- | :--- | :--- | :--- |
| `POST /api/admin/products` | `POST` | `credentials`, `verifyRole("admin")` | **Body:**<br>```json{  "name": "Giày Adidas Ultraboost",  "description": "Mô tả sản phẩm mới.",  "price": 3200000,  "thumbnail": "url_to_image",  "brandID": 2,  "categoryID": 2,  "variants": [    { "sizeID": 4, "colorID": 2, "quantity": 15 }  ]}``` | **Success (201 Created):**<br>```json{  "success": true,  "message": "Product created successfully",  "data": { /* a new product object */ }}```<br>**Error (400/401/403):**<br>```json{ "success": false, "message": "Error message" }``` |
| `PUT /api/admin/products/:id` | `PUT` | `credentials`, `verifyRole("admin")` | **URL Parameter:**<br>- `id` (int): The ID of the product.<br>**Body:**<br>```json{  "name": "Tên sản phẩm đã cập nhật",  "price": 3100000,  /* ...các trường khác... */ }``` | **Success (200):**<br>```json{  "success": true,  "message": "Product updated successfully",  "data": { /* a new product object */ }}```<br>**Error (400/401/403/404):**<br>```json{ "success": false, "message": "Error message" }``` |
| `DELETE /api/admin/products/:id` | `DELETE` | `credentials`, `verifyRole("admin")` | **URL Parameter:**<br>- `id` (int): The ID of the product. | **Success (200):**<br>```json{  "success": true,  "message": "Product deleted successfully"}```<br>**Error (401/403/404):**<br>```json{ "success": false, "message": "Error message" }``` |

### User Management

| API | Method | Middlewares | Request | Response |
| :--- | :--- | :--- | :--- | :--- |
| `GET /api/admin/users` | `GET` | `credentials`, `verifyRole("admin")` | **Query Params (Optional):**<br>- `page` (int)<br>- `limit` (int) | **Success (200):**<br>```json{  "success": true,  "data": {    "users": [      { "id": 1, "name": "User A", "email": "a@example.com", "roles": ["user"] }    ],    "pagination": { /* pagination object */ }  }}``` |
| `GET /api/admin/users/:id` | `GET` | `credentials`, `verifyRole("admin")` | **URL Parameter:**<br>- `id` (int): The ID of the user. | **Success (200):**<br>```json{  "success": true,  "data": { /* full user object */ }}```<br>**Error (404):**<br>```json{ "success": false, "message": "User not found" }``` |
| `PUT /api/admin/users/:id` | `PUT` | `credentials`, `verifyRole("admin")` | **URL Parameter:**<br>- `id` (int): The ID of the user.<br>**Body:**<br>```json{  "roles": ["user", "admin"],  "verify": true}``` | **Success (200):**<br>```json{  "success": true,  "message": "User updated successfully",  "data": { /* updated user object */ }}``` |
| `DELETE /api/admin/users/:id` | `DELETE` | `credentials`, `verifyRole("admin")` | **URL Parameter:**<br>- `id` (int): The ID of the user. | **Success (200):**<br>```json{  "success": true,  "message": "User deleted successfully" }``` |

### Order Management

| API | Method | Middlewares | Request | Response |
| :--- | :--- | :--- | :--- | :--- |
| `GET /api/admin/orders` | `GET` | `credentials`, `verifyRole("admin")` | **Query Params (Optional):**<br>- `status` (string): e.g., "Pending", "Delivered"<br>- `page` (int)<br>- `limit` (int) | **Success (200):**<br>```json{  "success": true,  "data": {    "orders": [      { "id": 1, "userID": 123, "status": "Pending", "total": 5000000 }    ],    "pagination": { /* pagination object */ }  }}``` |
| `PUT /api/admin/orders/:id` | `PUT` | `credentials`, `verifyRole("admin")` | **URL Parameter:**<br>- `id` (int): The ID of the order.<br>**Body:**<br>```json{ "status": "Shipped" }``` | **Success (200):**<br>```json{  "success": true,  "message": "Order status updated",  "data": { /* updated order object */ }}```<br>**Error (400/404):**<br>```json{ "success": false, "message": "Error message" }``` |

### Brand & Category Management

| API | Method | Middlewares | Request | Response |
| :--- | :--- | :--- | :--- | :--- |
| `GET /api/brands` | `GET` | - | - | **Success (200):**<br>```json{ "success": true, "data": [ { "id": 1, "name": "Nike" } ] }``` |
| `POST /api/admin/brands` | `POST` | `credentials`, `verifyRole("admin")` | **Body:**<br>```json{ "name": "Adidas" }``` | **Success (201):**<br>```json{ "success": true, "data": { "id": 2, "name": "Adidas" } }``` |
| `PUT /api/admin/brands/:id` | `PUT` | `credentials`, `verifyRole("admin")` | **URL Parameter:** `id`<br>**Body:**<br>```json{ "name": "Puma" }``` | **Success (200):**<br>```json{ "success": true, "data": { "id": 2, "name": "Puma" } }``` |
| `DELETE /api/admin/brands/:id` | `DELETE` | `credentials`, `verifyRole("admin")` | **URL Parameter:** `id` | **Success (200):**<br>```json{ "success": true, "message": "Brand deleted" }``` |
| `GET /api/categories` | `GET` | - | - | **Success (200):**<br>```json{ "success": true, "data": [ { "id": 1, "description": "Running Shoes" } ] }``` |
| `POST /api/admin/categories` | `POST` | `credentials`, `verifyRole("admin")` | **Body:**<br>```json{ "description": "Lifestyle" }``` | **Success (201):**<br>```json{ "success": true, "data": { "id": 2, "description": "Lifestyle" } }``` |
| `PUT /api/admin/categories/:id` | `PUT` | `credentials`, `verifyRole("admin")` | **URL Parameter:** `id`<br>**Body:**<br>```json{ "description": "Basketball" }``` | **Success (200):**<br>```json{ "success": true, "data": { "id": 2, "description": "Basketball" } }``` |
| `DELETE /api/admin/categories/:id` | `DELETE` | `credentials`, `verifyRole("admin")` | **URL Parameter:** `id` | **Success (200):**<br>```json{ "success": true, "message": "Category deleted" }``` |
