import NodeCache from "node-cache";

export const Cache = new NodeCache({
	stdTTL: 60 * 10,
	checkperiod: 60,
});
