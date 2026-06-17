-- CreateTable
CREATE TABLE "Depositos" (
    "id" SERIAL NOT NULL,
    "cuentaId" INTEGER NOT NULL,
    "moneda" VARCHAR(10) NOT NULL,
    "monto" DECIMAL(18,2) NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "Depositos_pkey" PRIMARY KEY ("id")
);

-- AddForeignKey
ALTER TABLE "Depositos" ADD CONSTRAINT "Depositos_cuentaId_fkey" FOREIGN KEY ("cuentaId") REFERENCES "Cuentas"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
