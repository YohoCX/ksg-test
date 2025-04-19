import { Controllers } from "@controllers";
import type { FastifyInstance } from "fastify";

export function controllerRegistry(app: FastifyInstance) {
	const controllers = [new Controllers.Skinport(), new Controllers.User()];
	for (const controller of controllers) {
		controller.registerRoutes(app);
	}
}
