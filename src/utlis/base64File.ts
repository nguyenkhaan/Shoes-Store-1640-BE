import { Express } from "express"
const base64File = (file : Express.Multer.File | undefined) => {
    if (!file) 
        return ''  
    const base64string = `data:${file.mimetype};base64,${file.buffer.toString('base64')}`; 
    return base64string
}

export default base64File