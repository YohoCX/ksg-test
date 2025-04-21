import { Cache } from "@cache";
import type { MergedItem, RawItem } from "@types";

export class Skinport {
	private readonly SKINPORT_BASE_URL = "https://api.skinport.com/v1";

	private async fetchItems(
		app_id: string,
		tradable: "1" | "0",
	): Promise<RawItem[]> {
		const queryParams = new URLSearchParams({
			app_id: app_id,
			tradable,
		});

		const url = `${this.SKINPORT_BASE_URL}/items?${queryParams.toString()}`;
		const res = await fetch(url);
		return res.json() as Promise<RawItem[]>;
	}

	public async updateItemsCache(app_id: number) {
		const [tradableItems, nonTradableItems] = await Promise.all([
			this.fetchItems(app_id.toString(), "1"),
			this.fetchItems(app_id.toString(), "0"),
		]);

		const mergedMap = new Map<string, MergedItem>();

		for (const item of tradableItems) {
			mergedMap.set(item.market_hash_name, {
				market_hash_name: item.market_hash_name,
				tradable_min_price: item.min_price,
				currency: item.currency,
				quantity: item.quantity,
				image: item.image,
			});
		}

		for (const item of nonTradableItems) {
			const existing = mergedMap.get(item.market_hash_name);
			if (existing) {
				existing.non_tradable_min_price = item.min_price;
			} else {
				mergedMap.set(item.market_hash_name, {
					market_hash_name: item.market_hash_name,
					non_tradable_min_price: item.min_price,
					currency: item.currency,
					quantity: item.quantity,
					image: item.image,
				});
			}
		}

		const merged = Array.from(mergedMap.values());
		Cache.set(`skinport_items_${app_id}`, merged);
		console.log(`Cached ${merged.length} merged items`);
	}

	public async getCachedItems(app_id: number): Promise<MergedItem[]> {
		const items = Cache.get<MergedItem[]>(`skinport_items_${app_id}`);

		if (items && items.length !== 0) {
			return items;
		}

		await this.updateItemsCache(app_id);

		const updatedCacheItems = Cache.get<MergedItem[]>(
			`skinport_items_${app_id}`,
		);

		if (!updatedCacheItems) {
			throw new Error("Failed to fetch items");
		}

		return updatedCacheItems;
	}
}
