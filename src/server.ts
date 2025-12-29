import app from '.'
import { ENV } from './configs/env.config'
import { Request , Response } from 'express'

app.get('/' , (req: Request , res : Response) => {
    return res.send('Hello world with expressJS') 
})

app.listen(ENV.PORT , () => {
    console.log('Server khoi dong thanh cong') 
})