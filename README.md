# FastMoney API

Backend de **FastMoney**, una billetera digital multimoneda que permite gestionar saldos en USD, EUR, ARS y COP, realizar transferencias entre usuarios, hacer depósitos y administrar metas de ahorro.

## Documentación interactiva

La documentación completa de la API está disponible en Swagger UI:

- **Producción:** https://fastmoney-api-ismael-4827.up.railway.app/api/docs
- **Local:** http://localhost:3000/api/docs

## Stack tecnológico

- **Runtime:** Node.js + TypeScript
- **Framework:** Express
- **ORM:** Prisma 7
- **Base de datos:** PostgreSQL
- **Autenticación:** JWT
- **Email:** AWS SES
- **Chatbot:** Google Gemini AI
- **Tasas de cambio:** ExchangeRate API
- **Deploy:** Railway

## Módulos de la API

| Módulo | Descripción |
|---|---|
| `Auth` | Registro, login y perfil del usuario |
| `Wallet` | Saldo total convertido y desglose por moneda |
| `Transferencia` | Transferencias entre usuarios con comisión y conversión automática |
| `Deposito` | Depósitos a la cuenta propia |
| `Ahorro` | Creación y gestión de metas de ahorro |
| `Chatbot` | Asistente financiero basado en Gemini AI |

## Endpoints principales

```
GET  /api/health                        Health check
POST /api/auth/register                 Registro de usuario
POST /api/auth/login                    Login (devuelve JWT)
GET  /api/auth/me                       Datos del usuario autenticado

GET  /api/wallet/balance/:moneda        Saldo total convertido
GET  /api/wallet/desglose               Saldo desglosado por moneda

POST /api/transferencia                 Realizar transferencia
GET  /api/transferencia/historial       Historial de transferencias

POST /api/deposito                      Realizar depósito
GET  /api/deposito/historial            Historial de depósitos

POST /api/ahorro                        Crear meta de ahorro
GET  /api/ahorro                        Listar metas de ahorro
PUT  /api/ahorro/:id                    Actualizar meta
DELETE /api/ahorro/:id                  Eliminar meta

POST /api/chatbot                       Enviar mensaje al chatbot
```

Los endpoints protegidos requieren el header `Authorization: Bearer <token>`.

## Variables de entorno

Crea un archivo `.env` basándote en `.env.example`:

```env
PORT=3000
DATABASE_URL=postgresql://user:password@localhost:5432/fastmoney
JWT_SECRET=tu_secreto_seguro_de_minimo_32_caracteres
JWT_EXPIRES_IN=7d
EXCHANGE_RATE_API_KEY=tu_api_key
COMMISSION_RATE=0.02
RATE_CACHE_TTL_MS=3600000
NODE_ENV=development

# AWS SES (opcional, solo para emails)
AWS_ACCESS_KEY_ID=...
AWS_SECRET_ACCESS_KEY=...
AWS_REGION=us-east-1
AWS_SES_FROM_EMAIL=...
```

## Instalación y ejecución local

```bash
npm install
npx prisma migrate dev
npm run dev
```

## Build para producción

```bash
npm run build
npm start
```
