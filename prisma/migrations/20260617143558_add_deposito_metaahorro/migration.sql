/*
  Warnings:

  - You are about to drop the `Notificaciones` table. If the table is not empty, all the data it contains will be lost.

*/
-- DropForeignKey
ALTER TABLE "Notificaciones" DROP CONSTRAINT "Notificaciones_usuarioId_fkey";

-- DropTable
DROP TABLE "Notificaciones";
