import prisma from "@/lib/prisma";
import { SeedUsers } from "@/lib/services";



async function main() {

  const result = await SeedUsers()

  return

}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });