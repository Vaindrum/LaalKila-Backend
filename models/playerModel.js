
import { query } from '../lib/db.js';


export async function createGuestPlayer(username) {
  const result = await query(
    `INSERT INTO players (username, is_guest)
     VALUES ($1, TRUE)
     RETURNING id, username, is_guest, created_at`,
    [username]
  );
  console.log('createGuestPlayer executed:', result.rows[0]);
  return result.rows[0];
}


export async function getPlayerById(id) {
  const result = await query(
    `SELECT id, username, is_guest, created_at
     FROM players
     WHERE id = $1`,
    [id]
  );
  return result.rows[0];
}


export async function createRegisteredPlayer(username) {
  const result = await query(
    `INSERT INTO players (username, is_guest)
     VALUES ($1, FALSE)
     RETURNING id, username, is_guest, created_at`,
    [username]
  );
  console.log('createRegisteredPlayer executed:', result.rows[0]);
  return result.rows[0];
}


export async function promoteGuestToRegistered(id) {
  const result = await query(
    `UPDATE players
     SET is_guest = FALSE
     WHERE id = $1
     RETURNING id, username, is_guest, created_at`,
    [id]
  );
  console.log('promoteGuestToRegistered executed:', result.rows[0]);
  return result.rows[0];
}

