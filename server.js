import dotenv from 'dotenv';
dotenv.config();

import express from 'express';
import cors from 'cors';
import http from 'http';
import { WebSocketServer } from 'ws';
import { query } from './lib/db.js'; 
import guestRouter from './routes/guest.js';
import playerRouter from './routes/player.js';
import roomRouter from './routes/room.js';


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
app.use('/api/player', playerRouter);
app.use('/api/rooms', roomRouter);

app.listen(4000, () => console.log('Server running on port 4000'));
