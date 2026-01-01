# API Documentation

## Authentication APIs

| API | Http method | Middleware can thiet | Request | Response |
| :--- | :--- | :--- | :--- | :--- |
| `/api/auth/register` | `POST` | `requireFields(["name", "email", "password", "phone", "address"])` | ```json { "name": "string", "email": "string", "password": "string", "phone": "string", "address": "string" } ``` | **Success (200):** ```json { "message": "Register successfully. Please check your email for verify", "success": true, "token": "string" } ``` <br> **Error (400/409/500):** ```json { "success": false, "message": "string" } ``` |
| `/api/auth/verify` | `GET` | - | **Query Parameter:** `token` <br> Example: `/api/auth/verify?token=your_jwt_token`| **Success (201):** ```json { "message": "Your email has been verified successfully", "success": true } ``` <br> **Error (400/401/500):** ```json { "success": false, "message": "string" } ``` |
| `/api/auth/login` | `POST` | `requireFields(["email", "password"])`, `checkUserStatusByEmail` | ```json { "email": "string", "password": "string" } ``` | **Success (200):** ```json { "success": true, "message": "Login successfully", "accessToken": "string", "refreshToken": "string" } ``` <br> **Error (401/500):** ```json { "success": false, "message": "string" } ``` |

## User APIs

Chưa có API người dùng nào được triển khai.
