import { Repository } from "@repositories";

export class User {
	private readonly userRepository: Repository.User;
	constructor() {
		this.userRepository = new Repository.User();
	}

	async getUserById(id: number) {
		return await this.userRepository.getUserById(id);
	}

	async subtractUserBalance(id: number, amount: number) {
		return this.userRepository.updateUserBalance(id, amount);
	}
}
