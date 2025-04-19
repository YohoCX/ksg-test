import { Config } from "@env";
import { Pool } from "pg";

const pool = new Pool({
	host: Config.PG.host,
	port: Config.PG.port,
	user: Config.PG.user,
	password: Config.PG.password,
	database: Config.PG.database,
});

async function seedUsers() {
	try {
		const result = await pool.query(
			"INSERT INTO users (balance) VALUES ($1) RETURNING *",
			[1000.0],
		);
		console.log("Seeded user:", result.rows[0]);
	} catch (err) {
		console.error("Seeding error:", err);
	} finally {
		await pool.end();
	}
}

seedUsers();
