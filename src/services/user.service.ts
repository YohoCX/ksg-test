import { Repository } from "@repositories";
import Decimal from "decimal.js";

export class User {
	private readonly userRepository: Repository.User;
	constructor() {
		this.userRepository = new Repository.User();
	}

	async getUserById(id: number) {
		return await this.userRepository.getUserById(id);
	}

	async subtractUserBalance(id: number, balance: number) {
		const user = await this.userRepository.getUserById(id);

		user.balance = this.subtractBalances(user.balance, balance.toString());

		return this.userRepository.updateUserBalance(user);
	}

	private addBalances(userBalance: string, amountToAdd: string): string {
		const userDecimal = new Decimal(userBalance);
		const amountToAddDecimal = new Decimal(amountToAdd);

		const result = userDecimal.plus(amountToAddDecimal);
		return result.toString(); // Return the result as a string or any desired format
	}

	private subtractBalances(
		userBalance: string,
		amountToSubtract: string,
	): string {
		const userDecimal = new Decimal(userBalance);
		const amountToSubtractDecimal = new Decimal(amountToSubtract);

		const result = userDecimal.minus(amountToSubtractDecimal);
		return result.toString(); // Return the result as a string or any desired format
	}
}
