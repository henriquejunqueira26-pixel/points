import postgres, { type Sql } from 'postgres';

export type Database = Sql;

/** Creates a PostgreSQL client. Migrations are deliberately explicit at deployment time. */
export function createDatabase(connectionString: string): Database {
  return postgres(connectionString, { max: 10 });
}

export async function closeDatabase(database: Database): Promise<void> {
  await database.end({ timeout: 5 });
}
