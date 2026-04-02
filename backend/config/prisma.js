const { PrismaClient } = require("@prisma/client");
const { PrismaPg } = require("@prisma/adapter-pg");
const { Pool } = require("pg");

let prisma;

const buildRuntimeDatabaseUrl = () => {
  const base = process.env.DIRECT_URL || process.env.DATABASE_URL;
  if (!base) return "";

  const url = new URL(base);

  // Prisma + driver adapter is more stable on direct Neon endpoint than pooler endpoint.
  if (url.hostname.includes("-pooler.")) {
    url.hostname = url.hostname.replace("-pooler.", ".");
  }

  // Avoid SCRAM channel binding hard requirement that can fail with some TLS stacks.
  if (url.searchParams.get("channel_binding") === "require") {
    url.searchParams.set("channel_binding", "prefer");
  }

  // Silence upcoming SSL mode alias warning while keeping strict verification semantics.
  if (url.searchParams.get("sslmode") === "require") {
    url.searchParams.set("sslmode", "verify-full");
  }

  return url.toString();
};

const createPrismaClient = () => {
  const connectionString = buildRuntimeDatabaseUrl();
  const sslConfig = connectionString.includes("neon.tech")
    ? { rejectUnauthorized: true }
    : false;

  const pool = new Pool({
    connectionString,
    ssl: sslConfig,
    application_name: "mailmirror",
    statement_timeout: 30000,
    query_timeout: 30000,
    max: 5,
    idleTimeoutMillis: 30000,
    connectionTimeoutMillis: 5000,
  });

  const adapter = new PrismaPg(pool);
  
  return new PrismaClient({
    adapter,
    errorFormat: "pretty",
    log: process.env.DATABASE_LOG ? ["query", "info", "warn", "error"] : ["warn", "error"],
  });
};

if (process.env.NODE_ENV === "production") {
  prisma = createPrismaClient();
} else {
  // Prevent multiple instances in development
  if (!global.prisma) {
    global.prisma = createPrismaClient();
  }
  prisma = global.prisma;
}

// Handle graceful shutdown
process.on("SIGINT", async () => {
  await prisma.$disconnect();
  process.exit(0);
});

process.on("SIGTERM", async () => {
  await prisma.$disconnect();
  process.exit(0);
});

module.exports = prisma;
