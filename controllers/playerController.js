import {
  createGuestPlayer,
  getPlayerById,
  createRegisteredPlayer,
  promoteGuestToRegistered
} from '../models/playerModel.js';


export async function handleCreateGuest(req, res) {
  try {
    const rawName = req.body?.username?.trim();
    const username = rawName && rawName.length > 0
      ? rawName
      : `Guest_${Math.floor(1000 + Math.random() * 9000)}`;

    const player = await createGuestPlayer(username);
    return res.status(201).json(player);
  } catch (err) {
    console.error('handleCreateGuest error:', err);
    return res.status(500).json({ error: 'Failed to create guest player' });
  }
}


export async function handleGetPlayer(req, res) {
  try {
    const id = parseInt(req.params.id, 10);
    if (isNaN(id)) {
      return res.status(400).json({ error: 'Invalid player ID' });
    }

    const player = await getPlayerById(id);
    if (!player) {
      return res.status(404).json({ error: 'Player not found' });
    }
    return res.json(player);
  } catch (err) {
    console.error('handleGetPlayer error:', err);
    return res.status(500).json({ error: 'Failed to fetch player' });
  }
}


export async function handleCreateRegistered(req, res) {
  try {
    const username = req.body?.username?.trim();
    if (!username) {
      return res.status(400).json({ error: 'Username is required' });
    }

    const player = await createRegisteredPlayer(username);
    return res.status(201).json(player);
  } catch (err) {
    console.error('handleCreateRegistered error:', err);
    // If unique constraint violation, return 409
    if (err.code === '23505') {
      return res.status(409).json({ error: 'Username already taken' });
    }
    return res.status(500).json({ error: 'Failed to register player' });
  }
}


export async function handlePromoteGuest(req, res) {
  try {
    const id = parseInt(req.params.id, 10);
    if (isNaN(id)) {
      return res.status(400).json({ error: 'Invalid player ID' });
    }

    const player = await promoteGuestToRegistered(id);
    if (!player) {
      return res.status(404).json({ error: 'Guest player not found' });
    }
    return res.json(player);
  } catch (err) {
    console.error('handlePromoteGuest error:', err);
    return res.status(500).json({ error: 'Failed to promote guest' });
  }
}
