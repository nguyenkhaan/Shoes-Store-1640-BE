import transporter from "~/configs/email.config";
import { mainOption } from "~/configs/email.config";

async function sendEmail(from: string , to: string , subject : string , content : string) : Promise<Boolean> 
{
    //from: nguoi gui, to: email nguoi nhan, subject: tieu de email, content: noi dung email 
    try 
    {
        const options = mainOption(from , to , subject , content) 
        const info = await transporter.sendMail(options) 
        console.log('>>> Email has sent to: ' , info.response) 
        return true 
    } 
    catch (err) 
    {
        console.log('>>> Send email err: ' , err) 
        return false 
    }
}
export default sendEmail 