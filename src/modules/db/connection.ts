import { Config } from "@env";
import { Pool } from "pg";

let pool: Pool;

export function getDbPool(): Pool {
	if (!pool) {
		pool = new Pool({
			host: Config.PG.host,
			port: Config.PG.port,
			user: Config.PG.user,
			password: Config.PG.password,
			database: Config.PG.database,
			max: 20,
			idleTimeoutMillis: 30000,
			connectionTimeoutMillis: 5000,
		});
	}
	return pool;
}
