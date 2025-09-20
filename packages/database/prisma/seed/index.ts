import { config as loadEnv } from "dotenv";

import { prisma } from "../../src/client";

loadEnv();

async function main() {
  // TODO: seed initial data once schema stabilises.
  console.info("Seed script placeholder - implement seeding logic here.");
}

main()
  .then(async () => {
    await prisma.$disconnect();
  })
  .catch(async (error) => {
    console.error(error);
    await prisma.$disconnect();
    process.exit(1);
  });
