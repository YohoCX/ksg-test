import { Services } from "@services";
import type { FastifyInstance } from "fastify";

export class Skinport {
	private readonly skinportService = new Services.Skinport();

	public registerRoutes(app: FastifyInstance) {
		app.get(
			"/skinport/items",
			{
				schema: {
					description: "Get merged skinport items from cache",
					tags: ["Skinport"],
					summary: "Fetch skinport items",
					querystring: {
						type: "object",
						properties: {
							app_id: { type: "number" },
						},
						required: ["app_id"],
					},
					response: {
						200: {
							type: "array",
							items: {
								type: "object",
								properties: {
									market_hash_name: { type: "string" },
									tradable_min_price: { type: "number", nullable: true },
									non_tradable_min_price: { type: "number", nullable: true },
									currency: { type: "string" },
									quantity: { type: "number" },
									image: { type: "string" },
								},
							},
						},
					},
				},
			},
			async (request, reply) => {
				const { app_id = 730 } = request.query as { app_id?: number };

				const items = await this.skinportService.getCachedItems(Number(app_id));
				reply.send(items);
			},
		);
	}
}
