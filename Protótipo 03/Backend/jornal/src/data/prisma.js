const { PrismaClient } = require("@prisma/client");
const PrismaPg = require("@prisma/adapter-pg");
//const { PrismaMariaDb } = require("@prisma/adapter-mariadb");

const adapter = new PrismaPg({ connectionString: process.env.DATABASE_URL });

const prisma = new PrismaClient({ adapter });

module.exports = prisma;
