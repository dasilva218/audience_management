import prisma from "@/lib/prisma";
import { SeedAudienceRequests, SeedMinistries, SeedUsers } from "@/lib/services";



async function main() {

  const result = await SeedAudienceRequests()
  // const result = await SeedUsers()
  // const result = await SeedMinistries()
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