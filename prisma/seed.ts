import { ENV } from "../src/configs/env.config"
import prisma from "../src/configs/mysqlPrisma.config"
import {generateHash} from "../src/utlis/hash"
async function main() 
{
 
    await prisma.role.createMany({
        data: [
            {role: "Admin" , id: 1810}, 
            {role : "User" , id : 1901}
        ]
    })
    const hashedAdminPassword = await generateHash(ENV.ADMIN_PASSWORD as string); 
    const admin = await prisma.user.create({
      data : {
        // id: 0, 
        name: 'admin', 
        address: 'uit', 
        email: ENV.ADMIN_EMAIL as string, 
        password: hashedAdminPassword, 
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
    //Tao them 1 user teseter 
    const hashedTesterPassword = await generateHash(ENV.TESTER_PASSWORD as string);  
    const tester = await prisma.user.create({
      data : {
        name : 'tester', 
        address: 'uit', 
        email: ENV.TESTER_EMAIL as string,
        phone: '0', 
        verify: true, 
        password: hashedTesterPassword 
      } 
    })  
    await prisma.userRole.create({
      data: {
        userID : tester.id, 
        roleID: 1901 //Vai tro la tester 
      }
    })   
   //Ham dung de tao nhanh kich thuoc 
      const MIN_SIZE = 20;
      const MAX_SIZE = 42;
      
      const sizes = Array.from(   
        { length: MAX_SIZE - MIN_SIZE + 1 },
        (_, i) => {
          const size = MIN_SIZE + i;
          return { value: size };
        }
      );
      
   await prisma.size.createMany({
    data: sizes 
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