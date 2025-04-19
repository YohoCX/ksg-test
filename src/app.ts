import { DB } from "@db";
import { Config } from "@env";
import * as swagger from "@fastify/swagger";
import * as swaggerUI from "@fastify/swagger-ui";
import Fastify from "fastify";
import { controllerRegistry } from "src/controllers/controller-registry";
import { errorHandler } from "src/handlers/error-handler";

async function bootstrap() {
	const app = Fastify({
		logger: true,
	});

	const pool = DB.getDbPool();
	app.addHook("onClose", async () => {
		console.log("Closing DB connection");
		await pool.end();
		console.log("DB connection closed");
	});

	app.setErrorHandler(errorHandler);

	await app.register(swagger, {
		openapi: {
			info: {
				title: "KSG Infinite API",
				description: "Skinport items API documentation",
				version: "1.0.0",
			},
		},
	});
	await app.register(swaggerUI, {
		routePrefix: "/docs",
		uiConfig: {
			docExpansion: "full",
		},
	});

	controllerRegistry(app);

	if (!Config.PORT) {
		console.log(Config.PORT);
		throw new Error("PORT environment variable is not set");
	}
	await app.listen({ port: Config.PORT });
}

bootstrap();
