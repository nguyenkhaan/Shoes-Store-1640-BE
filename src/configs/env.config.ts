import dotenv from 'dotenv' 
dotenv.config() 

const ENV = {
    PORT: process.env.PORT || 6869, 
    URL: process.env.URL || 'http://localhost:6869',
    ACCESS_TOKEN_SECRET: process.env.ACCESS_TOKEN_SECRET , //Key dung de giai ma access jwt token 
    REFRESH_TOKEN_SECRET: process.env.REFRESH_TOKEN_SECRET, //Key dung de giai ma refresh token 
    HOST: process.env.HOST, 
    DB_NAME: process.env.DB_NAME, 
    DB_USER: process.env.DB_USER, 
    DB_PASSWORD: process.env.DB_PASSWORD, 
    DB_PORT: 3306, 
    VERIFY_TOKEN_SECRET: process.env.VERIFY_TOKEN_SECRET //Key dung de giai ma refresh jwt token 
} 
export {ENV}

/**
 * ENV.
 * 
 * 
 */