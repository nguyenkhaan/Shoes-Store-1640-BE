# API Documentation

| Route | Method | Middlewares | Request | Response |
| :--- | :--- | :--- | :--- | :--- |
| **/api/auth/register** | `POST` | `upload.single("avatar")`, `requireFields(["name", "email", "password", "phone", "address"])` | `body: { name, email, password, phone, address, avatar (optional) }` | `{ success, message, token }` |
| **/api/auth/verify** | `GET` | | `query: { token }` | `{ success, message }` |
| **/api/auth/login** | `POST` | `Validation.email`, `Validation.password`, `requireFields(["email", "password"])`, `checkUserStatusByEmail()` | `body: { email, password }` | `{ success, message, accessToken, refreshToken }` |
| **/api/auth/refresh-token** | `GET` | `verifyRefreshToken` | | `{ success, message, accessToken }` |
| **/api/auth/logout** | `POST` | | | `{ success, message }` |
| **/api/auth/login-google** | `POST` | `requireFields(["code"])` | `body: { code }` | `{ success, accessToken, refreshToken }` |
| **/api/user/forgot-password** | `POST` | `credentials`, `requireFields(["email"])`, `checkUserStatusByEmail()` | `body: { email }` | `{ success, message, token }` |
| **/api/user/reset-password** | `POST` | `credentials`, `requireFields(["email", "token", "password"])`, `Validation.email`, `Validation.password`, `checkUserStatusByEmail()`, `verifyResetPasswordToken` | `body: { email, token, password }` | `{ success, message }` |
| **/api/user/profile** | `GET` | `credentials` | | `{ success, message, data: { id, name, email, phone, address, avatar, userRoles, createdAt } }` |
| **/api/user/update-profile** | `PATCH` | `credentials`, `requireFields(["name", "phone"])` | `body: { name, phone, address }` | `{ success, message, data: { id, name, email, phone, address, avatar, userRoles, createdAt } }` |
| **/api/user/update-avatar** | `PATCH` | `credentials`, `requireFields(["image_id"])` | `body: { image_id }` | `{ success, message, data: { avatar, url } }` |
| **/api/user/change-email** | `POST` | `credentials`, `requireFields(["email", "password"])`, `Validation.email`, `Validation.password` | `body: { email, password }` | `{ success, message, token }` |
| **/api/user/reset-email** | `POST` | `credentials`, `requireFields(["email", "token"])`, `verifyResetEmailToken` | `body: { email, token }` | `{ success, message }` |
| **/api/admin/forgot-password** | `GET` | | `query: { email }` | `{ success, message, token }` |
| **/api/brands** | `GET` | | | `{ success, message, data: [{ id, name }] }` |
| **/api/brands/:id** | `GET` | `Validation.numberIDParam` | `params: { id }` | `{ success, message, data: { id, name } }` |
| **/api/admin/brands** | `POST` | `credentials`, `verifyRole(["Admin"])`, `requireFields(["name"])` | `body: { name }` | `{ success, message, data: { id, name } }` |
| **/api/admin/brands/:id** | `PUT` | `credentials`, `verifyRole(["Admin"])`, `Validation.numberIDParam`, `requireFields(["name"])` | `params: { id }, body: { name }` | `{ success, message, data: { id, name } }` |
| **/api/admin/brands/:id** | `DELETE` | `credentials`, `verifyRole(["Admin"])`, `Validation.numberIDParam` | `params: { id }` | `{ success, message }` |
| **/api/cart** | `GET` | `credentials`, `checkUserStatusByID()` | | `{ success, message, cartID }` |
| **/api/cart** | `POST` | `credentials`, `checkUserStatusByID()`, `verifyRole(["Admin"])` | | `{ success, message, cartID }` |
| **/api/cart** | `DELETE` | `credentials`, `checkUserStatusByID()`, `verifyRole(["Admin"])` | | `{ success, message }` |
| **/api/colors** | `GET` | | | `{ success, message, data: [{ id, name, hex }] }` |
| **/api/colors/:id** | `GET` | `Validation.numberIDParam` | `params: { id }` | `{ success, message, data: { id, name, hex } }` |
| **/api/admin/colors** | `POST` | `credentials`, `verifyRole(["Admin"])`, `requireFields(["name", "hex"])` | `body: { name, hex }` | `{ success, message, data: { id, name, hex } }` |
| **/api/admin/colors/:id** | `PUT` | `credentials`, `verifyRole(["Admin"])`, `Validation.numberIDParam`, `requireFields(["name", "hex"])` | `params: { id }, body: { name, hex }` | `{ success, message, data: { id, name, hex } }` |
| **/api/admin/colors/:id** | `DELETE` | `credentials`, `verifyRole(["Admin"])`, `Validation.numberIDParam` | `params: { id }` | `{ success, message }` |
| **/api/order** | `POST` | `credentials`, `checkUserStatusByID()`, `requireFields(["shippingAddress", "paymentMethod", "items"])` | `body: { shippingAddress, paymentMethod, items: [{ productVariantID, quantity }] }` | `{ success, message, data: { id, userID, shippingAddress, paymentMethod, status, total, createdAt, orderItems } }` |
| **/api/order** | `GET` | `credentials`, `checkUserStatusByID()` | | `{ success, message, data: [{ id, userID, shippingAddress, paymentMethod, status, total, createdAt, orderItems }] }` |
| **/api/order/:id** | `GET` | `credentials`, `checkUserStatusByID()`, `Validation.numberIDParam` | `params: { id }` | `{ success, message, data: { id, userID, shippingAddress, paymentMethod, status, total, createdAt, orderItems } }` |
| **/api/order/:id/cancel** | `PUT` | `credentials`, `checkUserStatusByID()`, `Validation.numberIDParam` | `params: { id }` | `{ success, message }` |
| **/api/order/:id/address** | `PATCH` | `credentials`, `checkUserStatusByID()`, `Validation.numberIDParam`, `requireFields(["shippingAddress"])` | `params: { id }, body: { shippingAddress }` | `{ success, message }` |
| **/api/admin/orders** | `GET` | `credentials`, `verifyRole(["Admin"])` | | `{ success, message, data: [{ id, userID, shippingAddress, paymentMethod, status, total, createdAt, orderItems }] }` |
| **/api/admin/orders/:id** | `GET` | `credentials`, `verifyRole(["Admin"])`, `Validation.numberIDParam` | `params: { id }` | `{ success, message, data: { id, userID, shippingAddress, paymentMethod, status, total, createdAt, orderItems } }` |
| **/api/admin/orders/:id/status** | `PATCH` | `credentials`, `verifyRole(["Admin"])`, `Validation.numberIDParam`, `requireFields(["status"])` | `params: { id }, body: { status }` | `{ success, message }` |
| **/api/payment/process** | `POST` | `credentials`, `requireFields(["orderID", "paymentMethod"])` | `body: { orderID, paymentMethod }` | `{ success, message, data: { id, orderID, paymentMethod, status, amount } }` |
| **/api/payment/cancel** | `DELETE` | `credentials`, `requireFields(["orderID"])` | `body: { orderID }` | `{ success, message }` |
| **/api/product** | `GET` | | | `{ success, message, data: [{ id, name, description, price, active, thumbnail, brand, productVariants }] }` |
| **/api/product/search** | `GET` | | `query: { query }` | `{ success, message, data: [{ id, name, description, price, active, thumbnail, brand, productVariants }] }` |
| **/api/product/brand/:brandID** | `GET` | `Validation.numberIDParam` | `params: { brandID }` | `{ success, message, data: [{ id, name, description, price, active, thumbnail, brand, productVariants }] }` |
| **/api/product/:id** | `GET` | `Validation.numberIDParam` | `params: { id }` | `{ success, message, data: { id, name, description, price, active, thumbnail, brand, productVariants } }` |
| **/api/admin/products** | `GET` | `credentials`, `verifyRole(["Admin"])` | | `{ success, message, data: [{ id, name, description, price, active, thumbnail, brand, productVariants }] }` |
| **/api/admin/products** | `POST` | `credentials`, `verifyRole(["Admin"])`, `upload.single("thumbnail")`, `requireFields(["name", "description", "price", "active", "brandID"])` | `body: { name, description, price, active, brandID, thumbnail (optional) }` | `{ success, message, data: { id, name, description, price, active, thumbnail, brand, productVariants } }` |
| **/api/admin/products/:id** | `PUT` | `credentials`, `verifyRole(["Admin"])`, `upload.single("thumbnail")`, `Validation.numberIDParam` | `params: { id }, body: { name, description, price, active, brandID, thumbnail (optional) }` | `{ success, message, data: { id, name, description, price, active, thumbnail, brand, productVariants } }` |
| **/api/admin/products/:id** | `DELETE` | `credentials`, `verifyRole(["Admin"])`, `Validation.numberIDParam` | `params: { id }` | `{ success, message }` |
| **/api/sizes** | `GET` | | | `{ success, message, data: [{ id, value }] }` |
| **/api/sizes/:id** | `GET` | `Validation.numberIDParam` | `params: { id }` | `{ success, message, data: { id, value } }` |
| **/api/admin/sizes** | `POST` | `credentials`, `verifyRole(["Admin"])`, `requireFields(["value"])` | `body: { value }` | `{ success, message, data: { id, value } }` |
| **/api/admin/sizes/:id** | `PUT` | `credentials`, `verifyRole(["Admin"])`, `Validation.numberIDParam`, `requireFields(["value"])` | `params: { id }, body: { value }` | `{ success, message, data: { id, value } }` |
| **/api/admin/sizes/:id** | `DELETE` | `credentials`, `verifyRole(["Admin"])`, `Validation.numberIDParam` | `params: { id }` | `{ success, message }` |
