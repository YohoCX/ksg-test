import { Services } from "@services";
import type { FastifyInstance } from "fastify";

export class User {
	private readonly userService: Services.User;
	constructor() {
		this.userService = new Services.User();
	}

	public async registerRoutes(app: FastifyInstance) {
		app.get(
			"/users/:id",
			{
				schema: {
					description: "Get user by ID",
					tags: ["User"],
					summary: "Fetch user by ID",
					params: {
						type: "object",
						properties: {
							id: { type: "number" },
						},
						required: ["id"],
					},
					response: {
						200: {
							type: "object",
							properties: {
								id: { type: "number" },
								balance: { type: "number" },
							},
						},
					},
				},
			},
			async (request, reply) => {
				const { id } = request.params as { id: number };
				const user = await this.userService.getUserById(id);
				reply.send(user);
			},
		);

		app.post(
			"/users/:id/subtract-balance",
			{
				schema: {
					description: "Subtract balance from user",
					tags: ["User"],
					summary: "Subtract balance from user",
					params: {
						type: "object",
						properties: {
							id: { type: "number" },
						},
						required: ["id"],
					},
					body: {
						type: "object",
						properties: {
							amount: { type: "number" },
						},
						required: ["amount"],
					},
					response: {
						200: {
							type: "object",
							properties: {
								id: { type: "number" },
								balance: { type: "number" },
							},
						},
					},
				},
			},
			async (request, reply) => {
				const { id } = request.params as { id: number };
				const { amount } = request.body as { amount: number };

				const updatedUser = await this.userService.subtractUserBalance(
					id,
					amount,
				);
				reply.send(updatedUser);
			},
		);
	}
}
