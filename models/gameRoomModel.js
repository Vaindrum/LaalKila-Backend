// backend/models/gameRoomModel.js
import { query } from '../lib/db.js';
import { v4 as uuidv4 } from 'uuid';

/**
 * Create a new game room.
 * @param {Object} opts
 * @param {string} opts.code       — unique room code
 * @param {boolean} opts.isPrivate
 * @param {number} opts.capacity
 * @param {string} opts.gameType
 * @returns the created room row
 */
export async function createGameRoom({ code, isPrivate, capacity = 2, gameType }) {
  const result = await query(
    `INSERT INTO game_rooms
       (code, is_private, capacity, current_player, game_type)
     VALUES ($1, $2, $3, 0, $4)
     RETURNING id, code, is_private, capacity, current_player, game_type, created_at, (current_player < capacity) AS is_vacant`,
    [code, isPrivate, capacity, gameType]
  );
  console.log('createGameRoom executed:', result.rows[0]);
  return result.rows[0];
}

/**
 * Fetch a room by its numeric ID.
 */
export async function getGameRoomById(id) {
  const result = await query(
    `SELECT id, code, is_private, capacity, current_player, game_type, created_at,
     (current_player < capacity) AS is_vacant
     FROM game_rooms
     WHERE id = $1`,
    [id]
  );
  return result.rows[0];
}

/**
 * Fetch a room by its unique code.
 */
export async function getGameRoomByCode(code) {
  const result = await query(
    `SELECT id, code, is_private, capacity, current_player, game_type, created_at,
     (current_player < capacity) AS is_vacant
     FROM game_rooms
     WHERE code = $1`,
    [code]
  );
  return result.rows[0];
}

/**
 * Find an open (public) room for a given game type where there is vacancy.
 */
export async function findOpenRoom(gameType) {
  const result = await query(
    `SELECT id, code, is_private, capacity, current_player, game_type, created_at, (current_player < capacity) AS is_vacant
     FROM game_rooms
     WHERE is_private = FALSE
       AND game_type = $1
       AND current_player < capacity
     ORDER BY created_at ASC
     LIMIT 1`,
    [gameType]
  );
  return result.rows[0];
}

/**
 * Increment the current_player count by 1.
 * Also returns the updated row.
 */
export async function incrementPlayerCount(roomId) {
  const result = await query(
    `UPDATE game_rooms
     SET current_player = current_player + 1
     WHERE id = $1
     RETURNING id, code, is_private, capacity, current_player, game_type, created_at, (current_player < capacity) AS is_vacant`,
    [roomId]
  );
  return result.rows[0];
}

/**
 * Decrement the current_player count by 1 (e.g. on leave/disconnect).
 * Also returns the updated row.
 */
export async function decrementPlayerCount(roomId) {
  const result = await query(
    `UPDATE game_rooms
     SET current_player = GREATEST(current_player - 1, 0)
     WHERE id = $1
     RETURNING id, code, is_private, capacity, current_player, game_type, created_at, (current_player < capacity) AS is_vacant`,
    [roomId]
  );
  return result.rows[0];
}

/**
 * Mark a room as vacant/full based on current_player vs capacity.
 * Optional helper if you want an explicit flag.
 */
export async function updateVacancyStatus(roomId) {
  const result = await query(
    `UPDATE game_rooms
     SET is_vacant = (current_player < capacity)
     WHERE id = $1
     RETURNING id, current_player, capacity, (current_player < capacity) AS is_vacant`,
    [roomId]
  );
  return result.rows[0];
}
