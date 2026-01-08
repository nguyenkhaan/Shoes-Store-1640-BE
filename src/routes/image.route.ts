import { Request , Response } from 'express'
import Router from 'express'
import upload from '~/configs/multer.config'   //copy dong nay Neu gui goi tin dang multipart-form-data thi phai co no server moi parse du lieu ra duoc 
import base64File from '~/utlis/base64File'   //Ham nay dung de chuyen doi chuoi req.file thanh file base64 
import Cloudian from '~/services/cloudinary.services'  //Class chua cac ham thao tac voi anh (upload anh, xoa anh, lay url anh)
import prisma from "~/configs/mysqlPrisma.config";
const router = Router() 
//Route upload hinha nh 
router.post('/upload-image' , upload.single('image') , async (req : any , res: Response) => {
    const file = base64File(req.file) 
    if (file)   //Neu qua trinh chuyen doi thanh cong 
    {
        const result = await Cloudian.uploadImage(file) 
        console.log('>>> Ket qua upload anh: ' , result) //Lay public_id trong goi tin tra ve de luu vao database 

        const public_id = result.public_id; // Lay public_id de luu vao DB
        const { email } = req.body; // Lay email tu body request de xac dinh nguoi dung

        if (email) {
            // Thuc hien luu public_id vao truong avatar cua bang user trong database
            await prisma.user.update({
                where: { email: email },
                data: { avatar: public_id } 
            });
            console.log('>>> Đã lưu public_id vào DB cho user:', email);
        }

        return res.status(200).json({
            message: 'UPLOAD SUCCESSFULLY', 
            // data: res - Dong nay gay loi vi du lieu nay khong co parse duoc 
        })
    } 
    return res.status(500).json({
        message : "INTERNAL ERROR"
    })
}) 
router.post('/destroy-image' , upload.none(),  async (req : Request , res : Response) => {
    const {public_id} = req.body   //Ben FE gui ve goi tin Request yeu cau xoa anh, 
    //O day toi gia su truong id cua file co ten la public_id trong goi json gui ve. 
    //trong do co truong public_id. Tuy vao truong nay trong goi ten gi ma dieu chinh cho phu hop
    const responseData = await Cloudian.dropImage(public_id)
    console.log('>>> Ket qua xoa anh: ' , responseData) 
    return res.status(200).json({
        message: "DROP IMAGE SUCCESSFULLY"
    })
})
router.get('/get-image-url' , upload.none() , async (req : Request , res : Response) => {
    const {public_id} = req.body 
    const url = await Cloudian.getImageUrl(public_id) 
    console.log('>>> url nhan duoc la: ' , url) 
    return res.status(200).json({
        message: 'This is the url', 
        url 
    })
    //public_id vi du: Cl oud in ar ySho eSto re /1f0 eb a82-6 93d- 61 20-89 da-8c b4 07f8 416f (Xoa dau cach de su dung)
    //url ket qua vi du: https://res.cloudinary.com/dikd164hg/image/upload/v1/CloudinaryShoeStore/1f0eba82-693d-6120-89da-8cb407f8416f

})
//Route nao co upload hinh thi them middleware upload.single('filename') vao, filename la ten truong chua hinh anh cua request gui len 
export default router 
