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
        try 
        {
            const result = await cloudinary.uploader.destroy(public_id) 
            return result
        }
 
        catch (err) {
            console.log('Error in destroy images') 
            return null 
        }
    }
    static getImageUrl(public_id : string) 
    {
        return cloudinary.url(public_id , {
            secure: true 
        })
    }
    //Use for an array of images 
    static async uploadImageMany(files: Base64URLString[]) 
    {
        const validFiles = files.filter(
          (f): f is Base64URLString =>
            typeof f === "string" && f.trim() !== ""
        ) as string[];
      
        const results: string[] = [];
      
        for (const file of validFiles) {
          const res = await cloudinary.uploader.upload(file, {
            folder: "CloudinaryShoeStore",
            resource_type: "image",
            public_id: uuid(),
          });
          results.push(res.public_id);
        }
      
        return results;
    }
    static async dropImageMany(public_ids: string[]) 
    {
        const results = [] 
        for (const public_id of public_ids) {
            const res = cloudinary.uploader.destroy(public_id) 
            results.push(res) 
        } 
        return results 
    } 
    static getImageUrlMany(public_ids: string[]) 
    {
        const results = [] 
        for (const public_id of public_ids) {
            results.push(cloudinary.url(public_id , {
                secure: true 
            }))
        } 
        return results 
    }
    
}

export default Cloudian  