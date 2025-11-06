import { Api, ApiListResponse } from '../components/base/api';
import type { IOrderRequest, IProductApi } from '../types';
import fallbackCatalog from '../data/products.json';

type Prefix = '' | '/api/weblarek' | '/api' | '/weblarek';
type Resource = '/products' | '/items' | '/catalog';

function normalizeBase(url: string) {
	return url.endsWith('/') ? url.slice(0, -1) : url;
}

export class ShopApi extends Api {
	private resolved: { prefix: Prefix; resource: Resource } | null = null;

	private readonly prefixes: Prefix[];
	private readonly resources: Resource[] = ['/products', '/items', '/catalog'];

	constructor(baseUrl: string, options: RequestInit = {}) {
		const base = normalizeBase(baseUrl || '');
		super(base, options);
		this.prefixes = base.endsWith('/api/weblarek')
			? ['', '/api', '/weblarek']
			: ['/api/weblarek', '', '/api', '/weblarek'];
	}

	private async tryCombinations<T>(
		runner: (uri: string) => Promise<T>
	): Promise<{ data: T; prefix: Prefix; resource: Resource }> {
		const combos = this.resolved
			? [this.resolved]
			: this.prefixes.flatMap((prefix) =>
					this.resources.map((resource) => ({ prefix, resource }))
			  );

		let lastError: unknown;

		for (const { prefix, resource } of combos) {
			try {
				const data = await runner(`${prefix}${resource}`);
				this.resolved = { prefix, resource };
				return { data, prefix, resource };
			} catch (e: any) {
				lastError = e;
				const status = e?.status ?? e?.code;
				const msg = (e?.statusText || e?.message || '')
					.toString()
					.toLowerCase();
				const notFound = status === 404 || msg.includes('not found');
				if (!notFound) throw e;
			}
		}

		throw lastError ?? new Error('No working API path found');
	}

	async getProducts(): Promise<ApiListResponse<IProductApi>> {
		try {
			const { data } = await this.tryCombinations<ApiListResponse<IProductApi>>(
				(uri) => this.get<ApiListResponse<IProductApi>>(uri)
			);
			return data;
		} catch {
			return fallbackCatalog as ApiListResponse<IProductApi>;
		}
	}
	createOrder(
		order: IOrderRequest
	): Promise<{ id: string } & { total?: number }> {
		const prefix = this.resolved?.prefix ?? this.prefixes[0];
		return this.post<{ id: string } & { total?: number }>(
			`${prefix}/orders`,
			order,
			'POST'
		);
	}
}
