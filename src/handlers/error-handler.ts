import type { FastifyError, FastifyReply, FastifyRequest } from "fastify";

export function errorHandler(
	error: FastifyError,
	request: FastifyRequest,
	reply: FastifyReply,
) {
	console.error("Error occurred:", error);

	if (error instanceof SyntaxError) {
		reply.status(400).send({
			message: "Invalid JSON syntax",
		});
	} else if (error.validation) {
		reply.status(400).send({
			message: "Invalid request parameters",
			details: error.validation,
		});
	} else {
		reply.status(500).send({
			message: "Internal Server Error",
			details: error.message,
		});
	}
}
