import { ENV } from "../src/configs/env.config";
import prisma from "../src/configs/mysqlPrisma.config";
import { generateHash } from "../src/utlis/hash";
async function main() {
  // Tạo hoặc update roles (dùng upsert để tránh lỗi duplicate)
  await prisma.role.upsert({
    where: { id: 1810 },
    update: {},
    create: { role: "Admin", id: 1810 },
  });

  await prisma.role.upsert({
    where: { id: 1901 },
    update: {},
    create: { role: "User", id: 1901 },
  });

  // Kiểm tra admin đã tồn tại chưa
  const existingAdmin = await prisma.user.findUnique({
    where: { email: ENV.ADMIN_EMAIL as string },
  });

  if (!existingAdmin) {
    const hashedAdminPassword = await generateHash(ENV.ADMIN_PASSWORD as string);
    const admin = await prisma.user.create({
      data: {
        name: "admin",
        address: "uit",
        email: ENV.ADMIN_EMAIL as string,
        password: hashedAdminPassword,
        phone: "0",
        verify: true,
      }
    });
    //Tao mot gio hang cho admin 
    await prisma.cart.create(
      {
        data: {
          userID: admin.id   //Tien hanh tao them 1 gio hang cho admin 
        }
      }
    )

    await prisma.userRole.createMany({
      data: [
        { userID: admin.id, roleID: 1810 }, // Admin role
        { userID: admin.id, roleID: 1901 }, // User role
      ],
      skipDuplicates: true,
    });
  }

  // Kiểm tra tester đã tồn tại chưa
  const existingTester = await prisma.user.findUnique({
    where: { email: ENV.TESTER_EMAIL as string },
  });

  if (!existingTester) {
    const hashedTesterPassword = await generateHash(ENV.TESTER_PASSWORD as string);
    const tester = await prisma.user.create({
      data: {
        name: "tester",
        address: "uit",
        email: ENV.TESTER_EMAIL as string,
        phone: "0",
        verify: true,
        password: hashedTesterPassword,
      },
    });

    await prisma.userRole.create({
      data: {
        userID: tester.id,
        roleID: 1901, // User role
      },
    });
  }
  // Tạo các màu phổ biến
  const colors = [
    { name: "Đen", hex: "#000000" },
    { name: "Trắng", hex: "#FFFFFF" },
    { name: "Đỏ", hex: "#FF0000" },
    { name: "Xanh Dương", hex: "#0000FF" },
    { name: "Xanh Lá", hex: "#00FF00" },
    { name: "Vàng", hex: "#FFFF00" },
    { name: "Nâu", hex: "#8B4513" },
    { name: "Xám", hex: "#808080" },
    { name: "Hồng", hex: "#FFC0CB" },
    { name: "Cam", hex: "#FFA500" },
    { name: "Tím", hex: "#800080" },
    { name: "Be", hex: "#F5F5DC" },
    { name: "Xanh Navy", hex: "#000080" },
    { name: "Xanh Lơ", hex: "#00FFFF" },
    { name: "Bạc", hex: "#C0C0C0" },
    { name: "Vàng Gold", hex: "#FFD700" },
  ];

  await prisma.color.createMany({
    data: colors,
    skipDuplicates: true, // Skip nếu color đã tồn tại
  });
}
main()
  .then(async () => {
    await prisma.$disconnect();
  })
  .catch(async (e) => {
    console.error(e);
    await prisma.$disconnect();
    process.exit(1);
  });
