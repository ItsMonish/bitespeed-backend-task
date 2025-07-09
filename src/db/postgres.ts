import { Pool } from 'pg';

const databaseURL = process.env.DATABASE_URL;

const pool = new Pool({
    connectionString: databaseURL,
});

async function execute(query: string, params : (string | number | null)[]) {
    return await pool.query(query, params);
}

export default execute;