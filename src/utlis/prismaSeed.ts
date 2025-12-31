import prisma from "~/configs/mysqlPrisma.config"

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