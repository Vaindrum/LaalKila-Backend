// backend/routes/room.js
import express from 'express';
import {
  handleCreateRoom,
  handleGetRoomById,
  handleGetRoomByCode,
  handleFindOrCreatePublicRoom,
  handleJoinRoomById,
  handleLeaveRoom
} from '../controllers/gameRoomController.js';

const router = express.Router();

router.post('/', handleCreateRoom);
router.get('/:id', handleGetRoomById);
router.get('/code/:code', handleGetRoomByCode);
router.post('/join/public', handleFindOrCreatePublicRoom);
router.post('/:id/join', handleJoinRoomById);
router.post('/:id/leave', handleLeaveRoom);

export default router;
