import { Pool, type QueryResult, type QueryResultRow } from "pg";

declare global {
  // eslint-disable-next-line no-var
  var pgPool: Pool | undefined;
}

const connectionString = process.env.DATABASE_URL;

function getPool(): Pool | null {
  if (!connectionString) return null;
  if (!global.pgPool) {
    global.pgPool = new Pool({ connectionString });
  }
  return global.pgPool;
}

export const pool = getPool();

export async function query<T extends QueryResultRow = QueryResultRow>(
  text: string,
  params?: any[]
): Promise<QueryResult<T>> {
  if (!pool) {
    throw new Error("DATABASE_URL não configurada. Adicione ao .env.local");
  }
  return pool.query<T>(text, params);
}
