# API Documentation

| Route | Method | Middlewares | Request | Response |
| :--- | :--- | :--- | :--- | :--- |
| `/api/auth/register` | `POST` | `upload.single("avatar")`, `requireFields(["name", "email", "password", "phone", "address"])` | `body: { name, email, password, phone, address }`, `file: avatar` | `{ success, message, data }` |
| `/api/auth/verify` | `GET` | | `query: { token }` | `{ success, message }` |
| `/api/auth/login` | `POST` | `Validation.email`, `Validation.password`, `requireFields(["email", "password"])`, `checkUserStatusByEmail()` | `body: { email, password }` | `{ success, message, data: { accessToken, refreshToken } }` |
| `/api/auth/refresh-token` | `GET` | `verifyRefreshToken` | | `{ success, message, data: { accessToken } }` |
| `/api/auth/logout` | `POST` | | | `{ success, message }` |
| `/api/auth/login-google` | `POST` | `requireFields(["code"])` | `body: { code }` | `{ success, message, data: { accessToken, refreshToken } }` |
| `/api/admin/forgot-password` | `POST` | | `body: { email }` | `{ success, message }` |
| `/api/admin/brands` | `POST` | `credentials`, `verifyRole(["Admin"])`, `requireFields(["name"])` | `body: { name }` | `{ success, message, data: { brand } }` |
| `/api/admin/brands/:id` | `PUT` | `credentials`, `verifyRole(["Admin"])`, `Validation.numberIDParam`, `requireFields(["name"])` | `params: { id }`, `body: { name }` | `{ success, message, data: { brand } }` |
| `/api/admin/brands/:id` | `DELETE` | `credentials`, `verifyRole(["Admin"])`, `Validation.numberIDParam` | `params: { id }` | `{ success, message }` |
| `/api/admin/colors` | `POST` | `credentials`, `verifyRole(["Admin"])`, `requireFields(["name", "hex"])` | `body: { name, hex }` | `{ success, message, data: { color } }` |
| `/api/admin/colors/:id` | `PUT` | `credentials`, `verifyRole(["Admin"])`, `Validation.numberIDParam`, `requireFields(["name", "hex"])` | `params: { id }`, `body: { name, hex }` | `{ success, message, data: { color } }` |
| `/api/admin/colors/:id` | `DELETE` | `credentials`, `verifyRole(["Admin"])`, `Validation.numberIDParam` | `params: { id }` | `{ success, message }` |
| `/api/admin/orders` | `GET` | `credentials`, `verifyRole(["Admin"])` | | `{ success, message, data: { orders } }` |
| `/api/admin/orders/:id` | `GET` | `credentials`, `verifyRole(["Admin"])`, `Validation.numberIDParam` | `params: { id }` | `{ success, message, data: { order } }` |
| `/api/admin/orders/:id/status` | `PATCH` | `credentials`, `verifyRole(["Admin"])`, `Validation.numberIDParam`, `requireFields(["status"])` | `params: { id }`, `body: { status }` | `{ success, message, data: { order } }` |
| `/api/admin/products` | `GET` | `credentials`, `verifyRole(["Admin"])` | | `{ success, message, data: { products } }` |
| `/api/admin/products` | `POST` | `credentials`, `verifyRole(["Admin"])`, `upload.array("thumbnail")`, `requireFields(["name", "description", "price", "active", "brandID", "discount", "category"])` | `body: { name, description, price, active, brandID, discount, category }`, `files: thumbnail` | `{ success, message, data: { product } }` |
| `/api/admin/products/:id` | `PUT` | `credentials`, `verifyRole(["Admin"])`, `upload.array("thumbnail")`, `Validation.numberIDParam` | `params: { id }`, `body: { name, description, price, active, brandID, discount, category }`, `files: thumbnail` | `{ success, message, data: { product } }` |
| `/api/admin/products/:id` | `DELETE` | `credentials`, `verifyRole(["Admin"])`, `Validation.numberIDParam` | `params: { id }` | `{ success, message }` |
| `/api/admin/sizes` | `POST` | `credentials`, `verifyRole(["Admin"])`, `requireFields(["value"])` | `body: { value }` | `{ success, message, data: { size } }` |
| `/api/admin/sizes/:id` | `DELETE` | `credentials`, `verifyRole(["Admin"])`, `Validation.numberIDParam` | `params: { id }` | `{ success, message }` |
| `/api/admin/variants` | `POST` | `credentials`, `verifyRole(["Admin"])`, `requireFields(["productID"])` | `body: { productID, variants: [{ size, colorID, quantity }] }` | `{ success, message, data: { variants } }` |
| `/api/admin/variants/:id` | `PUT` | `credentials`, `verifyRole(["Admin"])`, `Validation.numberIDParam` | `params: { id }`, `body: { size, colorID, quantity }` | `{ success, message, data: { variant } }` |
| `/api/admin/variants/:id` | `DELETE` | `credentials`, `verifyRole(["Admin"])`, `Validation.numberIDParam` | `params: { id }` | `{ success, message }` |
| `/api/brands` | `GET` | | | `{ success, message, data: { brands } }` |
| `/api/brands/:id` | `GET` | `Validation.numberIDParam` | `params: { id }` | `{ success, message, data: { brand } }` |
| `/api/cart` | `GET` | `credentials`, `checkUserStatusByID()` | | `{ success, message, data: { carts } }` |
| `/api/cart` | `POST` | `credentials`, `checkUserStatusByID()`, `verifyRole(["Admin"])` | `body: { items: [{ productVariantID, quantity }] }` | `{ success, message, data: { cart } }` |
| `/api/cart` | `DELETE` | `credentials`, `checkUserStatusByID()`, `verifyRole(["Admin"])` | | `{ success, message }` |
| `/api/colors` | `GET` | | | `{ success, message, data: { colors } }` |
| `/api/colors/:id` | `GET` | `Validation.numberIDParam` | `params: { id }` | `{ success, message, data: { color } }` |
| `/api/upload-image` | `POST` | `upload.single("image")` | `file: image` | `{ message, data }` |
| `/api/destroy-image` | `POST` | `upload.none()` | `body: { public_id }` | `{ message }` |
| `/api/get-image-url` | `GET` | `upload.none()` | `query: { public_id }` | `{ message, url }` |
| `/api/orders` | `POST` | `credentials`, `checkUserStatusByID()`, `requireFields(["shippingAddress", "paymentMethod", "items"])` | `body: { shippingAddress, paymentMethod, items: [{ productVariantID, quantity }] }` | `{ success, message, data: { order } }` |
| `/api/orders` | `GET` | `credentials`, `checkUserStatusByID()` | | `{ success, message, data: { orders } }` |
| `/api/orders/:id` | `GET` | `credentials`, `checkUserStatusByID()`, `Validation.numberIDParam` | `params: { id }` | `{ success, message, data: { order } }` |
| `/api/orders/:id/cancel` | `PUT` | `credentials`, `checkUserStatusByID()`, `Validation.numberIDParam` | `params: { id }` | `{ success, message, data: { order } }` |
| `/api/orders/:id/address` | `PATCH` | `credentials`, `checkUserStatusByID()`, `Validation.numberIDParam`, `requireFields(["shippingAddress"])` | `params: { id }`, `body: { shippingAddress }` | `{ success, message, data: { order } }` |
| `/api/payment/process` | `POST` | `credentials`, `requireFields(["orderID", "paymentMethod"])` | `body: { orderID, paymentMethod }` | `{ success, message }` |
| `/api/payment/cancel` | `DELETE` | `credentials`, `requireFields(["orderID"])` | `body: { orderID }` | `{ success, message }` |
| `/api/product` | `GET` | | | `{ success, message, data: { products } }` |
| `/api/product/search` | `GET` | | `query: { q }` | `{ success, message, data: { products } }` |
| `/api/product/brand/:brandID` | `GET` | `Validation.numberIDParam` | `params: { brandID }` | `{ success, message, data: { products } }` |
| `/api/product/:id` | `GET` | `Validation.numberIDParam` | `params: { id }` | `{ success, message, data: { product } }` |
| `/api/sizes` | `GET` | | | `{ success, message, data: { sizes } }` |
| `/api/sizes/:id` | `GET` | `Validation.numberIDParam` | `params: { id }` | `{ success, message, data: { size } }` |
| `/api/user/forgot-password` | `POST` | `credentials`, `requireFields(["email"])`, `checkUserStatusByEmail()` | `body: { email }` | `{ success, message }` |
| `/api/user/reset-password` | `POST` | `credentials`, `requireFields(["email", "token", "password"])`, `Validation.email`, `Validation.password`, `checkUserStatusByEmail()`, `verifyResetPasswordToken` | `body: { email, token, password }` | `{ success, message }` |
| `/api/user/profile` | `GET` | `credentials` | | `{ success, message, data: { user } }` |
| `/api/user/update-profile` | `PATCH` | `credentials`, `requireFields(["name", "phone"])` | `body: { name, phone }` | `{ success, message, data: { user } }` |
| `/api/user/update-avatar` | `PATCH` | `credentials`, `requireFields(["image_id"])` | `body: { image_id }` | `{ success, message, data: { avatar, url } }` |
| `/api/user/change-email` | `POST` | `credentials`, `requireFields(["email", "password"])`, `Validation.email`, `Validation.password` | `body: { email, password }` | `{ success, message }` |
| `/api/user/reset-email` | `POST` | `credentials`, `requireFields(["email", "token"])`, `verifyResetEmailToken` | `body: { email, token }` | `{ success, message }` |
| `/api/variant` | `GET` | `credentials`, `verifyRole(["User"])` | | `{ success, message, data: { variants } }` |
| `/api/variant/get-by-product/:id` | `GET` | `credentials`, `verifyRole(["User"])` | `params: { id }` | `{ success, message, data: { variants } }` |
| `/api/variant/get-by-id` | `GET` | `credentials`, `verifyRole(["User"])` | `query: { id }` | `{ success, message, data: { variant } }` |
