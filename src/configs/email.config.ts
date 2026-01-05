import nodemailer from 'nodemailer' 
import { ENV } from '~/configs/env.config'

const transporter = nodemailer.createTransport({
    host: 'smtp.gmail.com', 
    port: 465, 
    secure: true, 
    auth: {
        user: ENV.SENDER as string, 
        pass: ENV.SENDER_PASSWORD as string 
    }, 
    tls: {
        rejectUnauthorized: false
    }
    
})

const mainOption = (from : string , to : string , subject: string, content : string) => {
    const options = {
        from , to , subject , html : content 
    }
    return options 
}
export default transporter
export {mainOption}