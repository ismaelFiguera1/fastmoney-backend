import 'dotenv/config';
import express from 'express';
import cors from 'cors';

// import authRoutes from './src/routes/auth.routes';
// import walletRoutes from './src/routes/wallet.routes';
// import transferRoutes from './src/routes/transfer.routes';
// import savingsRoutes from './src/routes/savings.routes';
// import errorHandler from './src/middleware/errorHandler';

const app = express();

app.use(cors());
app.use(express.json());

app.get('/api/health', (req, res) => res.json({ status: 'ok' }));

// app.use('/api/auth', authRoutes);
// app.use('/api/wallet', walletRoutes);
// app.use('/api/transfers', transferRoutes);
// app.use('/api/savings', savingsRoutes);

// app.use(errorHandler);

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => console.log(`Servidor corriendo en puerto ${PORT}`));
