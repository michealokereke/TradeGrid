import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient({
  log:
    process.env.NODE_ENV === "development"
      ? ["query", "error", "warn"]
      : ["error"],
});

process.on("SIGINT", async () => {
  await prisma.$disconnect();
  console.log("🔌 Database connection closed gracefully");
  process.exit(0);
});

export default prisma;
