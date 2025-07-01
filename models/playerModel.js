import { query } from '../lib/db.js';

export async function createGuestPlayer(username) {
  const result = await query(
    `INSERT INTO players (username, is_guest)
     VALUES ($1, TRUE)
     RETURNING id, username`,
    [username]
  );
  console.log('createGuestPlayer executed.');
  return result.rows[0];
}
