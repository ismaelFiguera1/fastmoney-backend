/*
  Warnings:

  - You are about to drop the column `moneda` on the `SaldosPorMoneda` table. All the data in the column will be lost.
  - You are about to drop the column `saldo` on the `SaldosPorMoneda` table. All the data in the column will be lost.
  - A unique constraint covering the columns `[cuentaId]` on the table `SaldosPorMoneda` will be added. If there are existing duplicate values, this will fail.

*/
-- DropIndex
DROP INDEX "SaldosPorMoneda_cuentaId_moneda_key";

-- AlterTable
ALTER TABLE "SaldosPorMoneda" DROP COLUMN "moneda",
DROP COLUMN "saldo",
ADD COLUMN     "ars" DECIMAL(18,2) NOT NULL DEFAULT 0,
ADD COLUMN     "cop" DECIMAL(18,2) NOT NULL DEFAULT 0,
ADD COLUMN     "eur" DECIMAL(18,2) NOT NULL DEFAULT 0,
ADD COLUMN     "usd" DECIMAL(18,2) NOT NULL DEFAULT 0;

-- CreateIndex
CREATE UNIQUE INDEX "SaldosPorMoneda_cuentaId_key" ON "SaldosPorMoneda"("cuentaId");
