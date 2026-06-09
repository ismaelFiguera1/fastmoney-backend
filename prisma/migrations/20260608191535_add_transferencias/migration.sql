-- CreateTable
CREATE TABLE "Transferencias" (
    "id" SERIAL NOT NULL,
    "cuentaOrigenId" INTEGER NOT NULL,
    "cuentaDestinoId" INTEGER NOT NULL,
    "moneda" VARCHAR(10) NOT NULL,
    "monto" DECIMAL(18,2) NOT NULL,
    "comision" DECIMAL(18,2) NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "Transferencias_pkey" PRIMARY KEY ("id")
);

-- AddForeignKey
ALTER TABLE "Transferencias" ADD CONSTRAINT "Transferencias_cuentaOrigenId_fkey" FOREIGN KEY ("cuentaOrigenId") REFERENCES "Cuentas"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Transferencias" ADD CONSTRAINT "Transferencias_cuentaDestinoId_fkey" FOREIGN KEY ("cuentaDestinoId") REFERENCES "Cuentas"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
