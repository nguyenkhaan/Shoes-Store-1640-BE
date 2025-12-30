import dotenv from 'dotenv' 
import { PrismaClient } from 'generated/prisma'
import { PrismaMariaDb } from '@prisma/adapter-mariadb'
import { ENV } from '~/configs/env.config'
dotenv.config() 

const adapter = new PrismaMariaDb({
    host: ENV.HOST as string, 
    connectionLimit: 10, 
    user: ENV.DB_USER as string, 
    password: ENV.DB_PASSWORD as string, 
    database: ENV.DB_NAME as string 
})

const prisma = new PrismaClient({adapter})

export default prisma 