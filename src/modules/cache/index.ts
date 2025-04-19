import * as NodeCache from "node-cache";

export const Cache = new NodeCache({
	stdTTL: 60 * 10, // 10 min
	checkperiod: 60,
});
