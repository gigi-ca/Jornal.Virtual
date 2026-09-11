/*
  Warnings:

  - The values [ALUNO] on the enum `Usuarios_tipo` will be removed. If these variants are still used in the database, this will fail.

*/
-- AlterTable
ALTER TABLE `usuarios` MODIFY `tipo` ENUM('USUARIO', 'VERIFICADO', 'ADMINISTRADOR') NOT NULL;
