import dotenv from 'dotenv' 
dotenv.config() 

const ENV = {
    PORT: process.env.PORT || 6869, 
    URL: process.env.URL || 'http://localhost:6869'
} 
export {ENV}