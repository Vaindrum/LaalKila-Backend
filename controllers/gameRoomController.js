import {
  createGameRoom,
  getGameRoomById,
  getGameRoomByCode,
  findOpenRoom,
  incrementPlayerCount,
  decrementPlayerCount,
  updateVacancyStatus
} from '../models/gameRoomModel.js';


export async function handleCreateRoom(req, res) {
  try {
    const { code, isPrivate = true, capacity = 2, gameType } = req.body;
    if (!gameType) {
      return res.status(400).json({ error: 'gameType is required' });
    }
    // You might generate a random code if none provided
    const roomCode = code || Math.random().toString(36).substr(2, 6).toUpperCase();
    const room = await createGameRoom({
      code: roomCode,
      isPrivate,
      capacity,
      gameType
    });
    return res.status(201).json(room);
  } catch (err) {
    console.error('handleCreateRoom error:', err);
    return res.status(500).json({ error: 'Failed to create room' });
  }
}


export async function handleGetRoomById(req, res) {
  try {
    const id = parseInt(req.params.id, 10);
    if (isNaN(id)) return res.status(400).json({ error: 'Invalid room ID' });
    const room = await getGameRoomById(id);
    if (!room) return res.status(404).json({ error: 'Room not found' });
    return res.json(room);
  } catch (err) {
    console.error('handleGetRoomById error:', err);
    return res.status(500).json({ error: 'Failed to fetch room' });
  }
}


export async function handleGetRoomByCode(req, res) {
  try {
    const { code } = req.params;
    const room = await getGameRoomByCode(code);
    if (!room) return res.status(404).json({ error: 'Room not found' });
    return res.json(room);
  } catch (err) {
    console.error('handleGetRoomByCode error:', err);
    return res.status(500).json({ error: 'Failed to fetch room' });
  }
}

export async function handleFindOrCreatePublicRoom(req, res) {
  try {
    const { gameType } = req.body;
    if (!gameType) return res.status(400).json({ error: 'gameType is required' });

    // Try to find an existing open room
    let room = await findOpenRoom(gameType);

    // If none, create a new public room
    if (!room) {
      room = await createGameRoom({
        code: Math.random().toString(36).substr(2, 6).toUpperCase(),
        isPrivate: false,
        capacity: 2,
        gameType
      });
    }

    // Increment the player count
    await incrementPlayerCount(room.id);

    // Fetch fresh room data
    const updated = await getGameRoomById(room.id);

    // Compute vacancy
    updated.is_vacant = updated.current_player < updated.capacity;

    return res.json(updated);
  } catch (err) {
    console.error('handleFindOrCreatePublicRoom error:', err);
    return res.status(500).json({ error: 'Failed to join or create public room' });
  }
}

export async function handleJoinRoomById(req, res) {
  try {
    const id = parseInt(req.params.id, 10);
    if (isNaN(id)) return res.status(400).json({ error: 'Invalid room ID' });

    // Check it exists
    const room = await getGameRoomById(id);
    if (!room) return res.status(404).json({ error: 'Room not found' });
    if (room.current_player >= room.capacity) {
      return res.status(400).json({ error: 'Room is full' });
    }

    // Increment count
    await incrementPlayerCount(id);

    // Fetch fresh room data
    const updated = await getGameRoomById(id);
    updated.is_vacant = updated.current_player < updated.capacity;

    return res.json(updated);
  } catch (err) {
    console.error('handleJoinRoomById error:', err);
    return res.status(500).json({ error: 'Failed to join room' });
  }
}


export async function handleLeaveRoom(req, res) {
  try {
    const id = parseInt(req.params.id, 10);
    if (isNaN(id)) return res.status(400).json({ error: 'Invalid room ID' });

    // Decrement count
    await decrementPlayerCount(id);

    // Fetch fresh room data
    const updated = await getGameRoomById(id);
    updated.is_vacant = updated.current_player < updated.capacity;

    return res.json(updated);
  } catch (err) {
    console.error('handleLeaveRoom error:', err);
    return res.status(500).json({ error: 'Failed to leave room' });
  }
}

