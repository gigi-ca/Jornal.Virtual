/*
  Warnings:

  - You are about to drop the column `atualizar_data` on the `noticias` table. All the data in the column will be lost.
  - You are about to drop the column `data_hora` on the `noticias` table. All the data in the column will be lost.
  - You are about to drop the column `status` on the `noticias` table. All the data in the column will be lost.
  - You are about to drop the column `sub_titulo` on the `noticias` table. All the data in the column will be lost.
  - You are about to drop the `_hashtagtonoticias` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `comentario` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `denuncia_comentario` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `denuncia_noticia` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `hashtag` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `midia` table. If the table is not empty, all the data it contains will be lost.
  - Added the required column `dataAtualizacao` to the `Noticias` table without a default value. This is not possible if the table is not empty.
  - Made the column `usuarioId` on table `noticias` required. This step will fail if there are existing NULL values in that column.
  - Added the required column `unidadeEscolar` to the `Usuarios` table without a default value. This is not possible if the table is not empty.

*/
-- DropForeignKey
ALTER TABLE `_hashtagtonoticias` DROP FOREIGN KEY `_HashtagToNoticias_A_fkey`;

-- DropForeignKey
ALTER TABLE `_hashtagtonoticias` DROP FOREIGN KEY `_HashtagToNoticias_B_fkey`;

-- DropForeignKey
ALTER TABLE `comentario` DROP FOREIGN KEY `Comentario_noticiasId_fkey`;

-- DropForeignKey
ALTER TABLE `comentario` DROP FOREIGN KEY `Comentario_usuarioId_fkey`;

-- DropForeignKey
ALTER TABLE `denuncia_comentario` DROP FOREIGN KEY `Denuncia_comentario_comentarioId_fkey`;

-- DropForeignKey
ALTER TABLE `denuncia_comentario` DROP FOREIGN KEY `Denuncia_comentario_usuarioId_fkey`;

-- DropForeignKey
ALTER TABLE `denuncia_noticia` DROP FOREIGN KEY `Denuncia_noticia_noticiasId_fkey`;

-- DropForeignKey
ALTER TABLE `denuncia_noticia` DROP FOREIGN KEY `Denuncia_noticia_usuarioId_fkey`;

-- DropForeignKey
ALTER TABLE `midia` DROP FOREIGN KEY `Midia_noticiasId_fkey`;

-- DropForeignKey
ALTER TABLE `noticias` DROP FOREIGN KEY `Noticias_usuarioId_fkey`;

-- DropIndex
DROP INDEX `Noticias_usuarioId_fkey` ON `noticias`;

-- AlterTable
ALTER TABLE `noticias` DROP COLUMN `atualizar_data`,
    DROP COLUMN `data_hora`,
    DROP COLUMN `status`,
    DROP COLUMN `sub_titulo`,
    ADD COLUMN `dataAtualizacao` DATETIME(3) NOT NULL,
    ADD COLUMN `dataPublicacao` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    ADD COLUMN `subtitulo` VARCHAR(191) NULL,
    MODIFY `usuarioId` INTEGER NOT NULL;

-- AlterTable
ALTER TABLE `usuarios` ADD COLUMN `bio` VARCHAR(191) NULL,
    ADD COLUMN `dataCriacao` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    ADD COLUMN `fotoPerfil` VARCHAR(191) NULL,
    ADD COLUMN `template` VARCHAR(191) NULL,
    ADD COLUMN `unidadeEscolar` VARCHAR(191) NOT NULL,
    MODIFY `tipo` ENUM('ALUNO', 'VERIFICADO', 'ADMINISTRADOR') NOT NULL;

-- DropTable
DROP TABLE `_hashtagtonoticias`;

-- DropTable
DROP TABLE `comentario`;

-- DropTable
DROP TABLE `denuncia_comentario`;

-- DropTable
DROP TABLE `denuncia_noticia`;

-- DropTable
DROP TABLE `hashtag`;

-- DropTable
DROP TABLE `midia`;

-- CreateTable
CREATE TABLE `MidiasNoticias` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `nomeOriginal` VARCHAR(191) NOT NULL,
    `nomeArquivo` VARCHAR(191) NOT NULL,
    `mimeType` VARCHAR(191) NOT NULL,
    `path` VARCHAR(191) NOT NULL,
    `dataUpload` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    `noticiaId` INTEGER NOT NULL,

    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `Publicacoes` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `texto` VARCHAR(191) NULL,
    `dataPublicacao` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    `usuarioId` INTEGER NOT NULL,

    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `MidiasPublicacoes` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `nomeOriginal` VARCHAR(191) NOT NULL,
    `nomeArquivo` VARCHAR(191) NOT NULL,
    `mimeType` VARCHAR(191) NOT NULL,
    `path` VARCHAR(191) NOT NULL,
    `dataUpload` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    `publicacaoId` INTEGER NOT NULL,

    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `Comentarios` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `texto` VARCHAR(191) NOT NULL,
    `dataPublicacao` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    `publicacaoId` INTEGER NOT NULL,
    `usuarioId` INTEGER NOT NULL,
    `comentarioPaiId` INTEGER NULL,

    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `Curtidas` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `usuarioId` INTEGER NOT NULL,
    `publicacaoId` INTEGER NOT NULL,

    UNIQUE INDEX `Curtidas_usuarioId_publicacaoId_key`(`usuarioId`, `publicacaoId`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `Hashtags` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `nome` VARCHAR(191) NOT NULL,
    `dataCriacao` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),

    UNIQUE INDEX `Hashtags_nome_key`(`nome`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `DenunciasPublicacao` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `motivo` VARCHAR(191) NOT NULL,
    `dataDenuncia` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    `publicacaoId` INTEGER NOT NULL,
    `usuarioId` INTEGER NOT NULL,

    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `DenunciasComentario` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `motivo` VARCHAR(191) NOT NULL,
    `dataDenuncia` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    `comentarioId` INTEGER NOT NULL,
    `usuarioId` INTEGER NOT NULL,

    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `_HashtagsToPublicacoes` (
    `A` INTEGER NOT NULL,
    `B` INTEGER NOT NULL,

    UNIQUE INDEX `_HashtagsToPublicacoes_AB_unique`(`A`, `B`),
    INDEX `_HashtagsToPublicacoes_B_index`(`B`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- AddForeignKey
ALTER TABLE `Noticias` ADD CONSTRAINT `Noticias_usuarioId_fkey` FOREIGN KEY (`usuarioId`) REFERENCES `Usuarios`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `MidiasNoticias` ADD CONSTRAINT `MidiasNoticias_noticiaId_fkey` FOREIGN KEY (`noticiaId`) REFERENCES `Noticias`(`id`) ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `Publicacoes` ADD CONSTRAINT `Publicacoes_usuarioId_fkey` FOREIGN KEY (`usuarioId`) REFERENCES `Usuarios`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `MidiasPublicacoes` ADD CONSTRAINT `MidiasPublicacoes_publicacaoId_fkey` FOREIGN KEY (`publicacaoId`) REFERENCES `Publicacoes`(`id`) ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `Comentarios` ADD CONSTRAINT `Comentarios_publicacaoId_fkey` FOREIGN KEY (`publicacaoId`) REFERENCES `Publicacoes`(`id`) ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `Comentarios` ADD CONSTRAINT `Comentarios_usuarioId_fkey` FOREIGN KEY (`usuarioId`) REFERENCES `Usuarios`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `Comentarios` ADD CONSTRAINT `Comentarios_comentarioPaiId_fkey` FOREIGN KEY (`comentarioPaiId`) REFERENCES `Comentarios`(`id`) ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `Curtidas` ADD CONSTRAINT `Curtidas_usuarioId_fkey` FOREIGN KEY (`usuarioId`) REFERENCES `Usuarios`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `Curtidas` ADD CONSTRAINT `Curtidas_publicacaoId_fkey` FOREIGN KEY (`publicacaoId`) REFERENCES `Publicacoes`(`id`) ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `DenunciasPublicacao` ADD CONSTRAINT `DenunciasPublicacao_publicacaoId_fkey` FOREIGN KEY (`publicacaoId`) REFERENCES `Publicacoes`(`id`) ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `DenunciasPublicacao` ADD CONSTRAINT `DenunciasPublicacao_usuarioId_fkey` FOREIGN KEY (`usuarioId`) REFERENCES `Usuarios`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `DenunciasComentario` ADD CONSTRAINT `DenunciasComentario_comentarioId_fkey` FOREIGN KEY (`comentarioId`) REFERENCES `Comentarios`(`id`) ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `DenunciasComentario` ADD CONSTRAINT `DenunciasComentario_usuarioId_fkey` FOREIGN KEY (`usuarioId`) REFERENCES `Usuarios`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `_HashtagsToPublicacoes` ADD CONSTRAINT `_HashtagsToPublicacoes_A_fkey` FOREIGN KEY (`A`) REFERENCES `Hashtags`(`id`) ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `_HashtagsToPublicacoes` ADD CONSTRAINT `_HashtagsToPublicacoes_B_fkey` FOREIGN KEY (`B`) REFERENCES `Publicacoes`(`id`) ON DELETE CASCADE ON UPDATE CASCADE;
