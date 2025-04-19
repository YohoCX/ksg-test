export type RawItem = {
	market_hash_name: string;
	min_price: number;
	currency: string;
	quantity: number;
	image: string;
};

export type MergedItem = {
	market_hash_name: string;
	tradable_min_price?: number;
	non_tradable_min_price?: number;
	currency: string;
	quantity: number;
	image: string;
};

export type UserType = {
	id: number;
	balance: number;
	created_at: string;
};
