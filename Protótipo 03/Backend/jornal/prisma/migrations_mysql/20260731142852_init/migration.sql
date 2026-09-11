/*
  Warnings:

  - You are about to drop the column `unidadeEscolar` on the `usuarios` table. All the data in the column will be lost.
  - A unique constraint covering the columns `[nome,empresaId]` on the table `Hashtags` will be added. If there are existing duplicate values, this will fail.
  - Added the required column `empresaId` to the `Hashtags` table without a default value. This is not possible if the table is not empty.
  - Added the required column `empresaId` to the `Noticias` table without a default value. This is not possible if the table is not empty.
  - Added the required column `empresaId` to the `Publicacoes` table without a default value. This is not possible if the table is not empty.
  - Added the required column `empresaId` to the `Usuarios` table without a default value. This is not possible if the table is not empty.

*/
-- DropIndex
DROP INDEX `Hashtags_nome_key` ON `hashtags`;

-- AlterTable
ALTER TABLE `hashtags` ADD COLUMN `empresaId` INTEGER NOT NULL;

-- AlterTable
ALTER TABLE `noticias` ADD COLUMN `empresaId` INTEGER NOT NULL;

-- AlterTable
ALTER TABLE `publicacoes` ADD COLUMN `empresaId` INTEGER NOT NULL;

-- AlterTable
ALTER TABLE `usuarios` DROP COLUMN `unidadeEscolar`,
    ADD COLUMN `empresaId` INTEGER NOT NULL;

-- CreateTable
CREATE TABLE `Empresa` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `nome` VARCHAR(191) NOT NULL,
    `nomeFantasia` VARCHAR(191) NULL,
    `cnpj` VARCHAR(191) NOT NULL,
    `email` VARCHAR(191) NULL,
    `telefone` VARCHAR(191) NULL,
    `endereco` VARCHAR(191) NULL,
    `numero` VARCHAR(191) NULL,
    `bairro` VARCHAR(191) NULL,
    `cidade` VARCHAR(191) NULL,
    `estado` VARCHAR(191) NULL,
    `cep` VARCHAR(191) NULL,
    `logo` VARCHAR(191) NULL,
    `corPrimaria` VARCHAR(191) NULL,
    `corSecundaria` VARCHAR(191) NULL,
    `dataCriacao` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),

    UNIQUE INDEX `Empresa_cnpj_key`(`cnpj`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateIndex
CREATE UNIQUE INDEX `Hashtags_nome_empresaId_key` ON `Hashtags`(`nome`, `empresaId`);

-- AddForeignKey
ALTER TABLE `Usuarios` ADD CONSTRAINT `Usuarios_empresaId_fkey` FOREIGN KEY (`empresaId`) REFERENCES `Empresa`(`id`) ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `Noticias` ADD CONSTRAINT `Noticias_empresaId_fkey` FOREIGN KEY (`empresaId`) REFERENCES `Empresa`(`id`) ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `Publicacoes` ADD CONSTRAINT `Publicacoes_empresaId_fkey` FOREIGN KEY (`empresaId`) REFERENCES `Empresa`(`id`) ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `Hashtags` ADD CONSTRAINT `Hashtags_empresaId_fkey` FOREIGN KEY (`empresaId`) REFERENCES `Empresa`(`id`) ON DELETE CASCADE ON UPDATE CASCADE;
