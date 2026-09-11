const { PrismaClient } = require("@prisma/client");
const { PrismaMariaDb } = require("@prisma/adapter-mariadb");

<<<<<<< HEAD
const adapter = new PrismaMariaDb({
    host: process.env.DB_HOST,
    port: Number(process.env.DB_PORT),
    user: process.env.DB_USER,
    password: process.env.DB_PASSWORD,
    database: process.env.DB_NAME
});
=======
const adapter = new PrismaMariaDb(process.env.DATABASE_URL);
>>>>>>> 3aa25da7ffcd96f2726ca0befa938173ba14cab3

const prisma = new PrismaClient({
    adapter
});

module.exports = prisma;