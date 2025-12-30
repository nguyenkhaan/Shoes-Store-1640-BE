import express from 'express'
import cors from 'cors'
import appConfig from './configs/app.config'
import router from '~/routes/router'
const app = express() 

// app.use(api) //Su dung router 
console.log(router) 
appConfig(app)
app.use(router)
app.use(cors({
    origin: ['http://localhost:5173']
}))

export default app 