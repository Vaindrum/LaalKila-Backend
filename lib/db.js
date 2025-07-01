import dotenv from 'dotenv';
dotenv.config();
import pkg from 'pg';
const { Pool } = pkg;

const pool = new Pool({
  user:   process.env.PG_USER,
  host:   process.env.PG_HOST,
  database: process.env.PG_DATABASE,
  password: process.env.PG_PASSWORD,
  port:   process.env.PG_PORT,
});

export async function query(text, params) {
  try {
    // console.log(pool.options);
    const res = await pool.query(text, params);
    console.log("Query run successfully.");
    return res;
  } catch (error) {
    console.log("Query failed to run.");
    throw error;
  }
}

export default pool;
