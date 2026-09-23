const { PrismaClient } = require("@prisma/client");
const { PrismaMariaDb } = require("@prisma/adapter-mariadb");

<<<<<<< HEAD
=======
// const adapter = new PrismaMariaDb({
//     host: process.env.DB_HOST,
//     port: Number(process.env.DB_PORT),
//     user: process.env.DB_USER,
//     password: process.env.DB_PASSWORD,
//     database: process.env.DB_NAME
// });

>>>>>>> 705b4014bda1ff851460a3e15c66cdb0775210dd
const adapter = new PrismaMariaDb(process.env.DATABASE_URL);

const prisma = new PrismaClient({
    adapter
});

module.exports = prisma;