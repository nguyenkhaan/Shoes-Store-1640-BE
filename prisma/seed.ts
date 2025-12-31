import prisma from "../src/configs/mysqlPrisma.config"
async function main() 
{
    await prisma.role.createMany({
        data: [
            {role: "Admin" , id: 1810}, 
            {role : "User" , id : 1901}
        ]
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