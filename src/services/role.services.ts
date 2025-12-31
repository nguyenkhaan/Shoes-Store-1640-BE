import ROLE_LISTS from "~/utlis/role_lists";
import prisma from "~/configs/mysqlPrisma.config";
type RoleName = "Admin" | "User"  //Su dung cai nay de chac chan moi phan tu chi co the la Admin hoac User 
async function assignUserRole(userID : number , roles : RoleName[])    //Mang danh sach cac role 
{
    try {
        const datas = roles.map((role) => {
            return {
                userID : userID, 
                roleID: ROLE_LISTS[role]
            }
        })
        await prisma.userRole.createMany({   //Tien hanh gan du lieu 
            data: datas 
        })
    } 
    catch (err) 
    {
        console.log('>>> Role Error: ' , err) 
        return null 
    }
}
export {assignUserRole}