require('dotenv').config();
const express = require('express');
const cors = require('cors');

// const authRoutes = require('./src/routes/auth.routes');
// const walletRoutes = require('./src/routes/wallet.routes');
// const transferRoutes = require('./src/routes/transfer.routes');
// const savingsRoutes = require('./src/routes/savings.routes');
// const errorHandler = require('./src/middleware/errorHandler');

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
