import express from 'express'
import cors from 'cors'
import appConfig from './configs/app.config'

const app = express() 
appConfig(app)
app.use(cors({
    origin: ['http://localhost:5173']
}))

export default app 