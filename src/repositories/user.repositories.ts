import { DB } from "@db";
import type { UserType } from "@types";
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

	async updateUserBalance(user: UserType) {
		const query = "UPDATE users SET balance = $1 WHERE id = $2";
		const values = [user.balance, user.id];
		await this.pool.query(query, values);
	}
}
