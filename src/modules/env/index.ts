import * as dotenv from "dotenv";
dotenv.config();

class Env {
	readonly PORT: number;
	readonly NODE_ENV: "development" | "production" | "test";
	readonly PG: {
		host: string;
		port: number;
		user: string;
		password: string;
		database: string;
	};

	constructor() {
		this.PORT = this.getNumber("PORT");
		this.NODE_ENV = this.get<"development" | "production" | "test">(
			"NODE_ENV",
			"development",
		);
		this.PG = {
			host: this.get("PG_HOST"),
			port: this.getNumber("PG_PORT"),
			user: this.get("PG_USER"),
			password: this.get("PG_PASSWORD"),
			database: this.get("PG_DATABASE"),
		};
	}

	private get<T = string>(key: string, fallback?: T): T {
		const value = process.env[key];
		if (value === undefined) {
			if (fallback !== undefined) return fallback;
			throw new Error(`Environment variable ${key} is not set`);
		}
		return value as unknown as T;
	}

	private getNumber(key: string, fallback?: number): number {
		const value = this.get<string>(key, fallback?.toString());
		const num = Number(value);
		if (Number.isNaN(num))
			throw new Error(`Environment variable ${key} must be a number`);
		return num;
	}
}

export const Config = new Env();
