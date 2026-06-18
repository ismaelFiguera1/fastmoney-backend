-- CreateTable
CREATE TABLE "Usuarios" (
    "id" SERIAL NOT NULL,
    "nombre" VARCHAR(100) NOT NULL,
    "apellido" VARCHAR(100) NOT NULL,
    "email" VARCHAR(150) NOT NULL,
    "hashContrasena" VARCHAR(255) NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "Usuarios_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Notificaciones" (
    "id" SERIAL NOT NULL,
    "usuarioId" INTEGER NOT NULL,
    "titulo" VARCHAR(150) NOT NULL,
    "mensaje" TEXT NOT NULL,
    "leido" BOOLEAN NOT NULL DEFAULT false,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "Notificaciones_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Cuentas" (
    "id" SERIAL NOT NULL,
    "usuarioId" INTEGER NOT NULL,
    "codigoCuenta" VARCHAR(36) NOT NULL,
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
    "usd" DECIMAL(18,2) NOT NULL DEFAULT 0,
    "eur" DECIMAL(18,2) NOT NULL DEFAULT 0,
    "ars" DECIMAL(18,2) NOT NULL DEFAULT 0,
    "cop" DECIMAL(18,2) NOT NULL DEFAULT 0,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "SaldosPorMoneda_pkey" PRIMARY KEY ("id")
);

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

-- CreateTable
CREATE TABLE "Depositos" (
    "id" SERIAL NOT NULL,
    "cuentaId" INTEGER NOT NULL,
    "moneda" VARCHAR(10) NOT NULL,
    "monto" DECIMAL(18,2) NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "Depositos_pkey" PRIMARY KEY ("id")
);

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

-- CreateIndex
CREATE UNIQUE INDEX "Usuarios_email_key" ON "Usuarios"("email");

-- CreateIndex
CREATE UNIQUE INDEX "Cuentas_usuarioId_key" ON "Cuentas"("usuarioId");

-- CreateIndex
CREATE UNIQUE INDEX "Cuentas_codigoCuenta_key" ON "Cuentas"("codigoCuenta");

-- CreateIndex
CREATE UNIQUE INDEX "SaldosPorMoneda_cuentaId_key" ON "SaldosPorMoneda"("cuentaId");

-- CreateIndex
CREATE UNIQUE INDEX "MetasAhorro_cuentaId_key" ON "MetasAhorro"("cuentaId");

-- AddForeignKey
ALTER TABLE "Notificaciones" ADD CONSTRAINT "Notificaciones_usuarioId_fkey" FOREIGN KEY ("usuarioId") REFERENCES "Usuarios"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Cuentas" ADD CONSTRAINT "Cuentas_usuarioId_fkey" FOREIGN KEY ("usuarioId") REFERENCES "Usuarios"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "SaldosPorMoneda" ADD CONSTRAINT "SaldosPorMoneda_cuentaId_fkey" FOREIGN KEY ("cuentaId") REFERENCES "Cuentas"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "MetasAhorro" ADD CONSTRAINT "MetasAhorro_cuentaId_fkey" FOREIGN KEY ("cuentaId") REFERENCES "Cuentas"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Depositos" ADD CONSTRAINT "Depositos_cuentaId_fkey" FOREIGN KEY ("cuentaId") REFERENCES "Cuentas"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Transferencias" ADD CONSTRAINT "Transferencias_cuentaOrigenId_fkey" FOREIGN KEY ("cuentaOrigenId") REFERENCES "Cuentas"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Transferencias" ADD CONSTRAINT "Transferencias_cuentaDestinoId_fkey" FOREIGN KEY ("cuentaDestinoId") REFERENCES "Cuentas"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
