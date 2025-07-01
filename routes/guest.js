import express from 'express';
import { createGuestPlayer } from '../models/playerModel.js';

const router = express.Router();

router.post('/', async (req, res) => {
  const username = req.body?.username?.trim() || `Guest_${Math.floor(1000 + Math.random() * 9000)}`;

  try {
    const player = await createGuestPlayer(username);
    res.status(200).json({ player_id: player.id });
  } catch (err) {
    console.error('Guest creation error:', err);
    res.status(500).json({ error: 'Failed to create guest' });
  }
});

export default router;
