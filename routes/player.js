// backend/routes/player.js
import express from 'express';
import {
  handleCreateGuest,
  handleGetPlayer,
  handleCreateRegistered,
  handlePromoteGuest
} from '../controllers/playerController.js';

const router = express.Router();

// Guest flows
router.post('/guest', handleCreateGuest);

// Registered user flows
router.post('/register', handleCreateRegistered);

// Fetch player by ID
router.get('/:id', handleGetPlayer);

// Promote guest to registered
router.post('/:id/promote', handlePromoteGuest);

export default router;
