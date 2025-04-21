import { DB } from "@db";
import type { Pool } from "pg";

export class User {
	private readonly pool: Pool;

	constructor() {
		this.pool = DB.getDbPool();
	}

	async getUserById(id: number) {
		const query = `SELECT * FROM "users" WHERE id = $1`;
		const values = [id];
		const { rows } = await this.pool.query(query, values);

		if (rows.length === 0) {
			throw new Error(`User with id ${id} not found`);
		}

		return rows[0];
	}

	async updateUserBalance(user_id: number, amount: number) {
		console.log(user_id, amount);
		const pool = DB.getDbPool();
		const query = `
		WITH updated AS (
			UPDATE users
			SET balance = balance - $1::DECIMAL
			WHERE id = $2 AND balance >= $1
			RETURNING balance
		)
		SELECT * FROM updated;
		`;

		const res = await pool.query(query, [amount, user_id]);

		if (res.rowCount === 0) {
			const exists = await pool.query("SELECT 1 FROM users WHERE id = $1", [
				user_id,
			]);
			console.log(exists);
			if (exists.rowCount === 0) {
				throw new Error("USER_NOT_FOUND");
			}
			throw new Error("INSUFFICIENT_FUNDS");
		}

		return res.rows[0];
	}
}
