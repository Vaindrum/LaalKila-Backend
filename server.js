import dotenv from 'dotenv';
dotenv.config();

import express from 'express';
import cors from 'cors';
import { query } from './lib/db.js'; 
import guestRouter from './routes/guest.js';



(async () => {
  try {
    const res = await query('SELECT NOW()');
    console.log('Connected to PostgreSQL at:', res.rows[0].now);
  } catch (err) {
    console.error('DB connection failed:', err.message);
  }
})();

const app = express();
app.use(cors());
app.use(express.json());

app.use('/api/guest', guestRouter);

app.listen(4000, () => console.log('Server running on port 4000'));
