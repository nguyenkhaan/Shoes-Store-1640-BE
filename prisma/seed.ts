import { ENV } from "../src/configs/env.config"
import prisma from "../src/configs/mysqlPrisma.config"
async function main() 
{
    await prisma.role.createMany({
        data: [
            {role: "Admin" , id: 1810}, 
            {role : "User" , id : 1901}
        ]
    })
    const admin = await prisma.user.create({
      data : {
        id: 0, 
        name: 'admin', 
        address: 'uit', 
        email: 'admin', 
        password: ENV.DB_PASSWORD as string, 
        phone: '0', 
        verify: true 
      }
    }) 
    await prisma.userRole.create({
      data: {
        userID : admin.id, 
        roleID: 1810, //Trao quyen Admin 

      }
    })
    await prisma.userRole.create({
      data : {
        userID: admin.id, 
        roleID: 1901 
      }
    })
}
main()
  .then(async () => {
    await prisma.$disconnect()
  })
  .catch(async (e) => {
    console.error(e)
    await prisma.$disconnect()
    process.exit(1)
  })