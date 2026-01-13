# API Documentation

| Route | Method | Middlewares | Request | Response |
| :--- | :--- | :--- | :--- | :--- |
| **/api/auth/register** | `POST` | `upload.single("avatar")`, `requireFields(["name", "email", "password", "phone", "address"])` | `body: { name, email, password, phone, address }`, `file: avatar` | `{ success, message, data }` |
| **/api/auth/verify** | `GET` | | `query: { token }` | `{ success, message }` |
| **/api/auth/login** | `POST` | `Validation.email`, `Validation.password`, `requireFields(["email", "password"])`, `checkUserStatusByEmail()` | `body: { email, password }` | `{ success, message, accessToken, refreshToken }` |
| **/api/auth/refresh-token** | `GET` | `verifyRefreshToken` | `cookies: { refreshToken }` | `{ success, message, accessToken }` |
| **/api/auth/logout** | `POST` | `credentials`, `verifyRole(["User"])` | | `{ success, message }` |
| **/api/auth/login-google** | `POST` | `requireFields(["code"])` | `body: { code }` | `{ success, message, accessToken, refreshToken }` |
| **/api/admin/brands** | `POST` | `credentials`, `verifyRole(["Admin"])`, `requireFields(["name"])` | `body: { name }` | `{ success, message, data }` |
| **/api/admin/brands/:id** | `PUT` | `credentials`, `verifyRole(["Admin"])`, `Validation.numberIDParam`, `requireFields(["name"])` | `params: { id }`, `body: { name }` | `{ success, message, data }` |
| **/api/admin/brands/:id** | `DELETE` | `credentials`, `verifyRole(["Admin"])`, `Validation.numberIDParam` | `params: { id }` | `{ success, message }` |
| **/api/admin/colors** | `POST` | `credentials`, `verifyRole(["Admin"])`, `requireFields(["name", "hex"])` | `body: { name, hex }` | `{ success, message, data }` |
| **/api/admin/colors/:id** | `PUT` | `credentials`, `verifyRole(["Admin"])`, `Validation.numberIDParam` | `params: { id }`, `body: { name, hex }` | `{ success, message, data }` |
| **/api/admin/colors/:id** | `DELETE` | `credentials`, `verifyRole(["Admin"])`, `Validation.numberIDParam` | `params: { id }` | `{ success, message }` |
| **/api/admin/sizes** | `POST` | `credentials`, `verifyRole(["Admin"])`, `requireFields(["value"])` | `body: { value }` | `{}` |
| **/api/admin/sizes/:id** | `DELETE` | `credentials`, `verifyRole(["Admin"])`, `Validation.numberIDParam` | `params: { id }` | `{}` |
| **/api/admin/products** | `GET` | `credentials`, `verifyRole(["Admin"])` | | `{ success, message, data }` |
| **/api/admin/products** | `POST` | `credentials`, `verifyRole(["Admin"])`, `upload.array("thumbnail")`, `requireFields(["name", "description", "price", "active", "brandID", "discount", "category"])` | `body: { name, description, price, active, brandID, discount, category }`, `files: thumbnail` | `{ success, message, data }` |
| **/api/admin/products/:id** | `PUT` | `credentials`, `verifyRole(["Admin"])`, `upload.array("thumbnail")`, `Validation.numberIDParam` | `params: { id }`, `body: { name, description, price, active, brandID, category, discount, remove_public_id }`, `files: thumbnail` | `{ success, message, data }` |
| **/api/admin/products/:id** | `DELETE` | `credentials`, `verifyRole(["Admin"])`, `Validation.numberIDParam` | `params: { id }` | `{ success, message }` |
| **/api/admin/variants** | `POST` | `credentials`, `verifyRole(["Admin"])`, `requireFields(["productID"])` | `body: { productID, size, colorID, quantity, variants }` | `{ success, message, data }` |
| **/api/admin/variants/:id** | `PUT` | `credentials`, `verifyRole(["Admin"])`, `Validation.numberIDParam` | `params: { id }`, `body: { size, colorID, quantity }` | `{ success, message, data }` |
| **/api/admin/variants/:id** | `DELETE` | `credentials`, `verifyRole(["Admin"])`, `Validation.numberIDParam` | `params: { id }` | `{ success, message }` |
| **/api/admin/orders** | `GET` | `credentials`, `verifyRole(["Admin"])` | | `{ success, message, data }` |
| **/api/admin/orders/:id** | `GET` | `credentials`, `verifyRole(["Admin"])`, `Validation.numberIDParam` | `params: { id }` | `{ success, message, data }` |
| **/api/admin/orders/:id/status** | `PATCH` | `credentials`, `verifyRole(["Admin"])`, `Validation.numberIDParam`, `requireFields(["status"])` | `params: { id }`, `body: { status }` | `{ success, message, data }` |
| **/api/user/forgot-password** | `POST` | `requireFields(["email"])`, `checkUserStatusByEmail()` | `body: { email }` | `{ success, message, token }` |
| **/api/user/reset-password** | `POST` | `requireFields(["email", "token", "password"])`, `Validation.email`, `Validation.password`, `checkUserStatusByEmail()`, `verifyResetPasswordToken` | `body: { email, token, password }` | `{ success, message }` |
| **/api/user/profile** | `GET` | `credentials` | | `{ success, message, data }` |
| **/api/user/update-profile** | `PATCH` | `credentials` | `body: { name, phone, address }` | `{ success, message, data }` |
| **/api/user/update-avatar** | `PATCH` | `upload.single("avatar")`, `credentials`, `verifyRole(["User"])` | `file: avatar` | `{ success, message, data }` |
| **/api/user/change-email** | `POST` | `credentials`, `verifyRole(["User"])`, `requireFields(["email", "password"])`, `Validation.email`, `Validation.password` | `body: { email, password }` | `{ success, message, token }` |
| **/api/user/reset-email** | `POST` | `credentials`, `requireFields(["email", "token"])`, `verifyResetEmailToken` | `body: { email, token }` | `{ success, message }` |
| **/api/colors** | `GET` | | | `{ success, message, data }` |
| **/api/colors/:id** | `GET` | `Validation.numberIDParam` | `params: { id }` | `{ success, message, data }` |
| **/api/brands** | `GET` | | | `{ success, message, data }` |
| **/api/brands/:id** | `GET` | `Validation.numberIDParam` | `params: { id }` | `{ success, message, data }` |
| **/api/upload-image** | `POST` | `upload.single("image")` | `file: image` | `{ message }` |
| **/api/destroy-image** | `POST` | `upload.none()` | `body: { public_id }` | `{ message }` |
| **/api/get-image-url** | `GET` | `upload.none()` | `query: { public_id }` | `{ message, url }` |
| **/api/cart/add-product** | `POST` | `credentials`, `verifyRole(["User"])`, `requireFields(["productID"])` | `body: { productID }` | `{ success, message, data }` |
| **/api/cart/remove-product/:id** | `DELETE` | `credentials`, `verifyRole(["User"])` | `params: { id }` | `{ success, message }` |
| **/api/cart/all-products** | `GET` | `credentials`, `verifyRole(["User"])` | | `{ success, message, data }` |
| **/api/cart** | `DELETE` | `credentials`, `checkUserStatusByID()`, `verifyRole(["Admin"])` | `body: { userID }` | `{ success, message }` |
| **/api/cart** | `GET` | `credentials`, `checkUserStatusByID()` | | `{ success, message, data }` |
| **/api/cart** | `POST` | `credentials`, `checkUserStatusByID()`, `verifyRole(["Admin"])` | `body: { userID }` | `{ success, message, data }` |
| **/api/payment/process** | `POST` | `credentials`, `requireFields(["orderID", "paymentMethod"])` | `body: { orderID, paymentMethod }` | `{ success, message, data }` |
| **/api/payment/cancel** | `DELETE` | `credentials`, `requireFields(["orderID"])` | `body: { orderID }` | `{ success, message }` |
| **/api/product** | `GET` | | | `{ success, message, data }` |
| **/api/product/search** | `GET` | | `query: { query }` | `{ success, message, data }` |
| **/api/product/brand/:brandID** | `GET` | `Validation.numberIDParam` | `params: { brandID }` | `{ success, message, data }` |
| **/api/product/:id** | `GET` | `Validation.numberIDParam` | `params: { id }` | `{ success, message, data }` |
| **/api/variant** | `GET` | `credentials`, `verifyRole(["User"])` | | `{ success, message, data }` |
| **/api/variant/get-by-product/:id** | `GET` | `credentials`, `verifyRole(["User"])` | `params: { id }` | `{ success, message, data }` |
| **/api/variant/get-by-id/:id** | `GET` | `credentials`, `verifyRole(["User"])` | `params: { id }` | `{ success, message, data }` |
| **/api/order** | `POST` | `credentials`, `checkUserStatusByID()`, `requireFields(["shippingAddress", "paymentMethod", "items"])` | `body: { shippingAddress, paymentMethod, items }` | `{ success, message, data }` |
| **/api/order** | `GET` | `credentials`, `checkUserStatusByID()` | | `{ success, message, data }` |
| **/api/order/:id** | `GET` | `credentials`, `checkUserStatusByID()`, `Validation.numberIDParam` | `params: { id }` | `{ success, message, data }` |
| **/api/order/:id/cancel** | `PUT` | `credentials`, `checkUserStatusByID()`, `Validation.numberIDParam` | `params: { id }` | `{ success, message, data }` |
| **/api/order/:id/address** | `PATCH` | `credentials`, `checkUserStatusByID()`, `Validation.numberIDParam`, `requireFields(["shippingAddress"])` | `params: { id }`, `body: { shippingAddress }` | `{ success, message, data }` |
