import { PrismaClient } from "../../generated/client.js";
import { PrismaPg } from "@prisma/adapter-pg";
import { ENV } from "./env.js";
// PrismaPg

const adapter = new PrismaPg({ connectionString: ENV.DATABASE_URL });
const prisma = new PrismaClient({ adapter });
process.on("SIGINT", async () => {
  await prisma.$disconnect();
  console.log("🔌 Database connection closed gracefully");
  process.exit(0);
});

export default prisma;
