import cloudinary from "~/configs/cloudinary.config";  //Them cai nay tu file config 
import uuid from '~/utlis/uuid'   //Thu muc dung de tao uuid 
//This version belong Cloudian, do not copy (Sory I am not good at typing English)
class Cloudian
{
    static async uploadImage(file : Base64URLString) //upload Image by base64 
    {
        const public_id = uuid() 
        const result = await cloudinary.uploader.upload(file , {
            folder: 'CloudinaryShoeStore',  
            resource_type: 'image',
            public_id  //Cai nay dung de drop anh hay gi do
        })
        return result
    } 
    static async dropImage(public_id : string)  //dropImage by id 
    {
        const result = await cloudinary.uploader.destroy(public_id) 
        return result 
    }
    static async getImageUrl(public_id : string) 
    {
        return cloudinary.url(public_id , {
            secure: true 
        })
    }
    
}

export default Cloudian  