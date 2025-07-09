import { Pool } from 'pg';

const pool = new Pool();

async function execute(query: string, params : (string | number | null)[]) {
    return await pool.query(query, params);
}

export default execute;