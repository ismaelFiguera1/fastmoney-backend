import express from 'express';
import cors from 'cors';
import authRoutes from './routes/auth.routes';
import walletRoutes from './routes/wallet.routes';

const app = express();

app.use(cors());
app.use(express.json());

app.get('/api/health', (req, res) => res.json({ status: 'ok' }));

app.use('/api/auth', authRoutes);
app.use('/api/wallet', walletRoutes);

export default app;
