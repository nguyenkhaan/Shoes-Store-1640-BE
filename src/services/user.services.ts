import prisma from "~/configs/mysqlPrisma.config"

async function createUser(username : string , email : string , password : string) {
    try {
        console.log('Dang khoi tao user')
        const result = await prisma.user.create({
            data: {
                username , email , password
            }
        })
        console.log('>>> Check result: ' , result) 
        return result 
    } 
    catch (err) 
    {
        console.log(err); //Su dung cai nay de log loi 
        return null 
    }

}
export { createUser };
