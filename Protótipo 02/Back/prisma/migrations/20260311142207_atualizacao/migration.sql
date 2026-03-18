/*
  Warnings:

  - Added the required column `atualizar_data` to the `Comentario` table without a default value. This is not possible if the table is not empty.
  - Added the required column `atualizar_data` to the `Noticias` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE `comentario` ADD COLUMN `atualizar_data` DATETIME(3) NOT NULL,
    ADD COLUMN `usuarioId` INTEGER NULL,
    MODIFY `data_hora` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3);

-- AlterTable
ALTER TABLE `noticias` ADD COLUMN `atualizar_data` DATETIME(3) NOT NULL,
    ADD COLUMN `data_hora` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3);

-- CreateTable
CREATE TABLE `Grupos` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `nome` VARCHAR(191) NOT NULL,
    `descricao` VARCHAR(191) NOT NULL,
    `data_hora` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    `atualizar_data` DATETIME(3) NOT NULL,

    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `UsuariosPorGrupos` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `usuariosId` INTEGER NULL,
    `gruposId` INTEGER NULL,

    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `Mensagens` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `texto` VARCHAR(191) NOT NULL,
    `data_hora` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    `atualizar_data` DATETIME(3) NOT NULL,
    `usuariosId` INTEGER NULL,
    `gruposId` INTEGER NULL,

    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- AddForeignKey
ALTER TABLE `Comentario` ADD CONSTRAINT `Comentario_usuarioId_fkey` FOREIGN KEY (`usuarioId`) REFERENCES `Usuarios`(`id`) ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `UsuariosPorGrupos` ADD CONSTRAINT `UsuariosPorGrupos_usuariosId_fkey` FOREIGN KEY (`usuariosId`) REFERENCES `Usuarios`(`id`) ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `UsuariosPorGrupos` ADD CONSTRAINT `UsuariosPorGrupos_gruposId_fkey` FOREIGN KEY (`gruposId`) REFERENCES `Grupos`(`id`) ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `Mensagens` ADD CONSTRAINT `Mensagens_usuariosId_fkey` FOREIGN KEY (`usuariosId`) REFERENCES `Usuarios`(`id`) ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `Mensagens` ADD CONSTRAINT `Mensagens_gruposId_fkey` FOREIGN KEY (`gruposId`) REFERENCES `Grupos`(`id`) ON DELETE SET NULL ON UPDATE CASCADE;
