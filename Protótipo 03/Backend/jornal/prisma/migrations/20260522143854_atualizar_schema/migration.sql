/*
  Warnings:

  - You are about to drop the column `hastagId` on the `noticias` table. All the data in the column will be lost.
  - You are about to drop the `hastag` table. If the table is not empty, all the data it contains will be lost.
  - Added the required column `motivo` to the `Denuncia_comentario` table without a default value. This is not possible if the table is not empty.
  - Added the required column `motivo` to the `Denuncia_noticia` table without a default value. This is not possible if the table is not empty.

*/
-- DropForeignKey
ALTER TABLE `noticias` DROP FOREIGN KEY `Noticias_hastagId_fkey`;

-- DropIndex
DROP INDEX `Noticias_hastagId_fkey` ON `noticias`;

-- AlterTable
ALTER TABLE `denuncia_comentario` ADD COLUMN `data_hora` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    ADD COLUMN `motivo` VARCHAR(191) NOT NULL,
    ADD COLUMN `usuarioId` INTEGER NULL;

-- AlterTable
ALTER TABLE `denuncia_noticia` ADD COLUMN `data_hora` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    ADD COLUMN `motivo` VARCHAR(191) NOT NULL,
    ADD COLUMN `usuarioId` INTEGER NULL;

-- AlterTable
ALTER TABLE `noticias` DROP COLUMN `hastagId`,
    ADD COLUMN `status` ENUM('PENDENTE', 'APROVADA', 'REJEITADA') NOT NULL DEFAULT 'PENDENTE';

-- DropTable
DROP TABLE `hastag`;

-- CreateTable
CREATE TABLE `Hashtag` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `categoria` VARCHAR(191) NOT NULL,

    UNIQUE INDEX `Hashtag_categoria_key`(`categoria`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `_HashtagToNoticias` (
    `A` INTEGER NOT NULL,
    `B` INTEGER NOT NULL,

    UNIQUE INDEX `_HashtagToNoticias_AB_unique`(`A`, `B`),
    INDEX `_HashtagToNoticias_B_index`(`B`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- AddForeignKey
ALTER TABLE `Denuncia_noticia` ADD CONSTRAINT `Denuncia_noticia_usuarioId_fkey` FOREIGN KEY (`usuarioId`) REFERENCES `Usuarios`(`id`) ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `Denuncia_comentario` ADD CONSTRAINT `Denuncia_comentario_usuarioId_fkey` FOREIGN KEY (`usuarioId`) REFERENCES `Usuarios`(`id`) ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `_HashtagToNoticias` ADD CONSTRAINT `_HashtagToNoticias_A_fkey` FOREIGN KEY (`A`) REFERENCES `Hashtag`(`id`) ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `_HashtagToNoticias` ADD CONSTRAINT `_HashtagToNoticias_B_fkey` FOREIGN KEY (`B`) REFERENCES `Noticias`(`id`) ON DELETE CASCADE ON UPDATE CASCADE;
