# API Documentation

| Index | Route | Method | Middlewares | Request | Response |
| :--- | :--- | :--- | :--- | :--- | :--- |
| 0 | **/api/auth/register** | `POST` | `upload.single("avatar")`, `requireFields(["name", "email", "password", "phone", "address"])` | `body: { name, email, password, phone, address }`, `file: avatar` | `{ success, message, data }` |
| 1 | **/api/auth/verify** | `GET` | | `query: { token }` | `{ success, message }` |
| 2 | **/api/auth/login** | `POST` | `Validation.email`, `Validation.password`, `requireFields(["email", "password"])`, `checkUserStatusByEmail()` | `body: { email, password }` | `{ success, message, accessToken, refreshToken }` |
| 3 | **/api/auth/refresh-token** | `GET` | `verifyRefreshToken` | `cookies: { refreshToken }` | `{ success, message, accessToken }` |
| 4 | **/api/auth/logout** | `POST` | `credentials`, `verifyRole(["User"])` | | `{ success, message }` |
| 5 | **/api/auth/login-google** | `POST` | `requireFields(["code"])` | `body: { code }` | `{ success, message, accessToken, refreshToken }` |
| 6 | **/api/admin/brands** | `POST` | `credentials`, `verifyRole(["Admin"])`, `requireFields(["name"])` | `body: { name }` | `{ success, message, data }` |
| 7 | **/api/admin/brands/:id** | `PUT` | `credentials`, `verifyRole(["Admin"])`, `Validation.numberIDParam`, `requireFields(["name"])` | `params: { id }`, `body: { name }` | `{ success, message, data }` |
| 8 | **/api/admin/brands/:id** | `DELETE` | `credentials`, `verifyRole(["Admin"])`, `Validation.numberIDParam` | `params: { id }` | `{ success, message }` |
| 9 | **/api/admin/colors** | `POST` | `credentials`, `verifyRole(["Admin"])`, `requireFields(["name", "hex"])` | `body: { name, hex }` | `{ success, message, data }` |
| 10 | **/api/admin/colors/:id** | `PUT` | `credentials`, `verifyRole(["Admin"])`, `Validation.numberIDParam` | `params: { id }`, `body: { name, hex }` | `{ success, message, data }` |
| 11 | **/api/admin/colors/:id** | `DELETE` | `credentials`, `verifyRole(["Admin"])`, `Validation.numberIDParam` | `params: { id }` | `{ success, message }` |
| 12 | **/api/admin/sizes** | `POST` | `credentials`, `verifyRole(["Admin"])`, `requireFields(["value"])` | `body: { value }` | `{}` |
| 13 | **/api/admin/sizes/:id** | `DELETE` | `credentials`, `verifyRole(["Admin"])`, `Validation.numberIDParam` | `params: { id }` | `{}` |
| 14 | **/api/admin/products** | `GET` | `credentials`, `verifyRole(["Admin"])` | | `{ success, message, data }` |
| 15 | **/api/admin/products** | `POST` | `credentials`, `verifyRole(["Admin"])`, `upload.array("thumbnail")`, `requireFields(["name", "description", "price", "active", "brandID", "discount", "category"])` | `body: { name, description, price, active, brandID, discount, category }`, `files: thumbnail` | `{ success, message, data }` |
| 16 | **/api/admin/products/:id** | `PUT` | `credentials`, `verifyRole(["Admin"])`, `upload.array("thumbnail")`, `Validation.numberIDParam` | `params: { id }`, `body: { name, description, price, active, brandID, category, discount, remove_public_id }`, `files: thumbnail` | `{ success, message, data }` |
| 17 | **/api/admin/products/:id** | `DELETE` | `credentials`, `verifyRole(["Admin"])`, `Validation.numberIDParam` | `params: { id }` | `{ success, message }` |
| 18 | **/api/admin/variants** | `POST` | `credentials`, `verifyRole(["Admin"])`, `requireFields(["productID"])` | `body: { productID, size, colorID, quantity, variants }` | `{ success, message, data }` |
| 19 | **/api/admin/variants/:id** | `PUT` | `credentials`, `verifyRole(["Admin"])`, `Validation.numberIDParam` | `params: { id }`, `body: { size, colorID, quantity }` | `{ success, message, data }` |
| 20 | **/api/admin/variants/:id** | `DELETE` | `credentials`, `verifyRole(["Admin"])`, `Validation.numberIDParam` | `params: { id }` | `{ success, message }` |
| 21 | **/api/admin/orders** | `GET` | `credentials`, `verifyRole(["Admin"])` | | `{ success, message, data }` |
| 22 | **/api/admin/orders/:id** | `GET` | `credentials`, `verifyRole(["Admin"])`, `Validation.numberIDParam` | `params: { id }` | `{ success, message, data }` |
| 23 | **/api/admin/orders/:id/status** | `PATCH` | `credentials`, `verifyRole(["Admin"])`, `Validation.numberIDParam`, `requireFields(["status"])` | `params: { id }`, `body: { status }` | `{ success, message, data }` |
| 24 | **/api/user/forgot-password** | `POST` | `requireFields(["email"])`, `checkUserStatusByEmail()` | `body: { email }` | `{ success, message, token }` |
| 25 | **/api/user/reset-password** | `POST` | `requireFields(["email", "token", "password"])`, `Validation.email`, `Validation.password`, `checkUserStatusByEmail()`, `verifyResetPasswordToken` | `body: { email, token, password }` | `{ success, message }` |
| 26 | **/api/user/profile** | `GET` | `credentials` | | `{ success, message, data }` |
| 27 | **/api/user/update-profile** | `PATCH` | `credentials` | `body: { name, phone, address }` | `{ success, message, data }` |
| 28 | **/api/user/update-avatar** | `PATCH` | `upload.single("avatar")`, `credentials`, `verifyRole(["User"])` | `file: avatar` | `{ success, message, data }` |
| 29 | **/api/user/change-email** | `POST` | `credentials`, `verifyRole(["User"])`, `requireFields(["email", "password"])`, `Validation.email`, `Validation.password` | `body: { email, password }` | `{ success, message, token }` |
| 30 | **/api/user/reset-email** | `POST` | `credentials`, `requireFields(["email", "token"])`, `verifyResetEmailToken` | `body: { email, token }` | `{ success, message }` |
| 31 | **/api/colors** | `GET` | | | `{ success, message, data }` |
| 32 | **/api/colors/:id** | `GET` | `Validation.numberIDParam` | `params: { id }` | `{ success, message, data }` |
| 33 | **/api/brands** | `GET` | | | `{ success, message, data }` |
| 34 | **/api/brands/:id** | `GET` | `Validation.numberIDParam` | `params: { id }` | `{ success, message, data }` |
| 35 | **/api/upload-image** | `POST` | `upload.single("image")` | `file: image` | `{ message }` |
| 36 | **/api/destroy-image** | `POST` | `upload.none()` | `body: { public_id }` | `{ message }` |
| 37 | **/api/get-image-url** | `GET` | `upload.none()` | `query: { public_id }` | `{ message, url }` |
| 38 | **/api/cart/add-product** | `POST` | `credentials`, `verifyRole(["User"])`, `requireFields(["productID"])` | `body: { productID }` | `{ success, message, data }` |
| 39 | **/api/cart/remove-product/:id** | `DELETE` | `credentials`, `verifyRole(["User"])` | `params: { id }` | `{ success, message }` |
| 40 | **/api/cart/all-products** | `GET` | `credentials`, `verifyRole(["User"])` | | `{ success, message, data }` |
| 41 | **/api/cart** | `DELETE` | `credentials`, `checkUserStatusByID()`, `verifyRole(["Admin"])` | `body: { userID }` | `{ success, message }` |
| 42 | **/api/cart** | `GET` | `credentials`, `checkUserStatusByID()` | | `{ success, message, data }` |
| 43 | **/api/cart** | `POST` | `credentials`, `checkUserStatusByID()`, `verifyRole(["Admin"])` | `body: { userID }` | `{ success, message, data }` |
| 44 | **/api/payment/process** | `POST` | `credentials`, `requireFields(["orderID", "paymentMethod"])` | `body: { orderID, paymentMethod }` | `{ success, message, data }` |
| 45 | **/api/payment/cancel** | `DELETE` | `credentials`, `requireFields(["orderID"])` | `body: { orderID }` | `{ success, message }` |
| 46 | **/api/product** | `GET` | | | `{ success, message, data }` |
| 47 | **/api/product/search** | `GET` | | `query: { query }` | `{ success, message, data }` |
| 48 | **/api/product/brand/:brandID** | `GET` | `Validation.numberIDParam` | `params: { brandID }` | `{ success, message, data }` |
| 49 | **/api/product/:id** | `GET` | `Validation.numberIDParam` | `params: { id }` | `{ success, message, data }` |
| 50 | **/api/variant** | `GET` | `credentials`, `verifyRole(["User"])` | | `{ success, message, data }` |
| 51 | **/api/variant/get-by-product/:id** | `GET` | `credentials`, `verifyRole(["User"])` | `params: { id }` | `{ success, message, data }` |
| 52 | **/api/variant/get-by-id/:id** | `GET` | `credentials`, `verifyRole(["User"])` | `params: { id }` | `{ success, message, data }` |
| 53 | **/api/order** | `POST` | `credentials`, `checkUserStatusByID()`, `requireFields(["shippingAddress", "paymentMethod", "items"])` | `body: { shippingAddress, paymentMethod, items }` | `{ success, message, data }` |
| 54 | **/api/order** | `GET` | `credentials`, `checkUserStatusByID()` | | `{ success, message, data }` |
| 55 | **/api/order/:id** | `GET` | `credentials`, `checkUserStatusByID()`, `Validation.numberIDParam` | `params: { id }` | `{ success, message, data }` |
| 56 | **/api/order/:id/cancel** | `PUT` | `credentials`, `checkUserStatusByID()`, `Validation.numberIDParam` | `params: { id }` | `{ success, message, data }` |
| 57 | **/api/order/:id/address** | `PATCH` | `credentials`, `checkUserStatusByID()`, `Validation.numberIDParam`, `requireFields(["shippingAddress"])` | `params: { id }`, `body: { shippingAddress }` | `{ success, message, data }` |
