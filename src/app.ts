import express from 'express';
import cors from 'cors';
import fs from 'fs';
import path from 'path';
import yaml from 'js-yaml';
import swaggerUi from 'swagger-ui-express';
import authRoutes from './routes/auth.routes';
import walletRoutes from './routes/wallet.routes';
import transferenciaRoutes from './routes/transferencia.routes';
import chatbotRoutes from "./routes/chatbot.routes";
import depositoRoutes from './routes/deposito.routes';
import ahorroRoutes from './routes/ahorro.routes';
import notificacionRoutes from "./routes/notificacion.routes";

const swaggerDocument = yaml.load(
  fs.readFileSync(path.join(process.cwd(), 'openapi.yaml'), 'utf8')
) as object;


const app = express();

app.use(cors({ origin: process.env.FRONTEND_URL || '*' }));
app.use(express.json());
app.use("/api/chatbot", chatbotRoutes);

app.use('/api/docs', swaggerUi.serve, swaggerUi.setup(swaggerDocument));

app.get('/api/health', (req, res) => res.json({ status: 'ok' }));
app.use("/api/notificacion", notificacionRoutes);

app.use('/api/auth', authRoutes);
app.use('/api/wallet', walletRoutes);
app.use('/api/transferencia', transferenciaRoutes);
app.use('/api/deposito', depositoRoutes);
app.use('/api/ahorro', ahorroRoutes);

export default app;
