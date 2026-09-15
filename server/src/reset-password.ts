import bcrypt from "bcrypt";
import { prisma } from "./lib/prisma";

async function main() {
  const newPassword = "IGCC@12345";

  const passwordHash = await bcrypt.hash(newPassword, 12);

  await prisma.user.update({
    where: {
      username: "testadmin",
    },
    data: {
      passwordHash,
    },
  });

  console.log("Password reset successfully.");
}

main()
  .catch(console.error)
  .finally(() => prisma.$disconnect());