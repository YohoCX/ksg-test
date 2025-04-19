import { readFileSync, readdirSync } from "node:fs";
import * as path from "node:path";
import { Config } from "@env";
import { Pool } from "pg";

const pool = new Pool({
	host: Config.PG.host,
	port: Config.PG.port,
	user: Config.PG.user,
	password: Config.PG.password,
	database: Config.PG.database,
	max: 20,
	idleTimeoutMillis: 30000,
	connectionTimeoutMillis: 5000,
});

async function runMigrations() {
	const client = await pool.connect();

	try {
		await client.query("BEGIN");

		await client.query(`
      CREATE TABLE IF NOT EXISTS migrations (
        id SERIAL PRIMARY KEY,
        name TEXT NOT NULL UNIQUE,
        created_at TIMESTAMP DEFAULT NOW()
      )
    `);

		const appliedRes = await client.query("SELECT name FROM migrations");
		const applied = new Set(appliedRes.rows.map((row) => row.name));

		const files = readdirSync(path.join(path.resolve(), "migrations")).sort();

		for (const file of files) {
			if (applied.has(file)) continue;

			const sql = readFileSync(
				path.join(path.resolve(), "migrations", file),
				"utf-8",
			);
			console.log(`Running migration: ${file}`);
			await client.query(sql);
			await client.query("INSERT INTO migrations(name) VALUES($1)", [file]);
		}

		await client.query("COMMIT");
		console.log("Migrations complete");
	} catch (err) {
		await client.query("ROLLBACK");
		console.error("Migration failed", err);
	} finally {
		client.release();
		await pool.end();
	}
}

runMigrations();
