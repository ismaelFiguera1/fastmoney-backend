/*
  Warnings:

  - You are about to drop the column `actualizadoEn` on the `Usuarios` table. All the data in the column will be lost.
  - You are about to drop the column `creadoEn` on the `Usuarios` table. All the data in the column will be lost.
  - You are about to drop the column `moneda` on the `Usuarios` table. All the data in the column will be lost.
  - Added the required column `updatedAt` to the `Usuarios` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "Usuarios" DROP COLUMN "actualizadoEn",
DROP COLUMN "creadoEn",
DROP COLUMN "moneda",
ADD COLUMN     "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
ADD COLUMN     "updatedAt" TIMESTAMP(3) NOT NULL;

-- CreateTable
CREATE TABLE "Cuentas" (
    "id" SERIAL NOT NULL,
    "usuarioId" INTEGER NOT NULL,
    "codigoCuenta" VARCHAR(20) NOT NULL,
    "monedaBase" VARCHAR(10) NOT NULL DEFAULT 'USD',
    "activa" BOOLEAN NOT NULL DEFAULT true,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "Cuentas_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "SaldosPorMoneda" (
    "id" SERIAL NOT NULL,
    "cuentaId" INTEGER NOT NULL,
    "moneda" VARCHAR(10) NOT NULL,
    "saldo" DECIMAL(65,30) NOT NULL DEFAULT 0,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "SaldosPorMoneda_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "Cuentas_usuarioId_key" ON "Cuentas"("usuarioId");

-- CreateIndex
CREATE UNIQUE INDEX "Cuentas_codigoCuenta_key" ON "Cuentas"("codigoCuenta");

-- CreateIndex
CREATE UNIQUE INDEX "SaldosPorMoneda_cuentaId_moneda_key" ON "SaldosPorMoneda"("cuentaId", "moneda");

-- AddForeignKey
ALTER TABLE "Cuentas" ADD CONSTRAINT "Cuentas_usuarioId_fkey" FOREIGN KEY ("usuarioId") REFERENCES "Usuarios"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "SaldosPorMoneda" ADD CONSTRAINT "SaldosPorMoneda_cuentaId_fkey" FOREIGN KEY ("cuentaId") REFERENCES "Cuentas"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
