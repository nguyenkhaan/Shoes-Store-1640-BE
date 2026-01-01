import ROLE_LISTS from "~/utlis/role_lists";
import prisma from "~/configs/mysqlPrisma.config";
type RoleName = "Admin" | "User"  //Su dung cai nay de chac chan moi phan tu chi co the la Admin hoac User 
import { ROLE_MAP } from "~/utlis/role_lists";
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
async function findRoles(userID: number): Promise<string[]> {  //Tim kiem role dua tren userID da duoc xac thuc 
    try {
      const roles = await prisma.userRole.findMany({
        where: { userID },
        select: { roleID: true }
      })
  
      if (roles.length === 0) return []
  
      return ROLE_MAP(roles.map(r => r.roleID))
    } catch (err) {
      console.error(">>> Find Role Error", err)
      throw new Error("Cannot fetch user roles")
    }
  }
  
export {assignUserRole , findRoles}