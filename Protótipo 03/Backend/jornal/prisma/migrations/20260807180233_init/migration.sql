/*
  Warnings:

  - You are about to drop the column `bairro` on the `empresa` table. All the data in the column will be lost.
  - You are about to drop the column `corPrimaria` on the `empresa` table. All the data in the column will be lost.
  - You are about to drop the column `corSecundaria` on the `empresa` table. All the data in the column will be lost.
  - You are about to drop the column `numero` on the `empresa` table. All the data in the column will be lost.

*/
-- AlterTable
ALTER TABLE `empresa` DROP COLUMN `bairro`,
    DROP COLUMN `corPrimaria`,
    DROP COLUMN `corSecundaria`,
    DROP COLUMN `numero`;

-- CreateTable
CREATE TABLE `TemaEmpresa` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `primary` VARCHAR(191) NOT NULL DEFAULT '#2563eb',
    `primaryDark` VARCHAR(191) NOT NULL DEFAULT '#1d4ed8',
    `secondary` VARCHAR(191) NOT NULL DEFAULT '#7c3aed',
    `secondaryLight` VARCHAR(191) NOT NULL DEFAULT '#a78bfa',
    `background` VARCHAR(191) NOT NULL DEFAULT '#f8fafc',
    `surface` VARCHAR(191) NOT NULL DEFAULT '#ffffff',
    `text` VARCHAR(191) NOT NULL DEFAULT '#1f2937',
    `textLight` VARCHAR(191) NOT NULL DEFAULT '#6b7280',
    `border` VARCHAR(191) NOT NULL DEFAULT '#e5e7eb',
    `danger` VARCHAR(191) NOT NULL DEFAULT '#ef4444',
    `empresaId` INTEGER NOT NULL,

    UNIQUE INDEX `TemaEmpresa_empresaId_key`(`empresaId`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- AddForeignKey
ALTER TABLE `TemaEmpresa` ADD CONSTRAINT `TemaEmpresa_empresaId_fkey` FOREIGN KEY (`empresaId`) REFERENCES `Empresa`(`id`) ON DELETE CASCADE ON UPDATE CASCADE;
