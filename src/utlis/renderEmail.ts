import fs from 'fs' 
import path from 'path' 
import ejs from 'ejs'
async function renderEmail(templateName : string , data: Record<string, any>) : Promise<string> 
{
    const templatePath = path.join(__dirname, '../templates' , `${templateName}.ejs`) 
    console.log(templatePath)
    return await ejs.renderFile(templatePath , data)   //Truyen data vao ben trong template 
} 
export default renderEmail

//Record: Mot bang ghi gom co 2 truong 