-- CreateTable
CREATE TABLE "MetasAhorro" (
    "id" SERIAL NOT NULL,
    "cuentaId" INTEGER NOT NULL,
    "nombre" VARCHAR(200) NOT NULL,
    "limite" DECIMAL(18,2) NOT NULL,
    "divisa" VARCHAR(10) NOT NULL,
    "imagen" VARCHAR(500),
    "saldoAhorrado" DECIMAL(18,2) NOT NULL DEFAULT 0,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "MetasAhorro_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "MetasAhorro_cuentaId_key" ON "MetasAhorro"("cuentaId");

-- AddForeignKey
ALTER TABLE "MetasAhorro" ADD CONSTRAINT "MetasAhorro_cuentaId_fkey" FOREIGN KEY ("cuentaId") REFERENCES "Cuentas"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
