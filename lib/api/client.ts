import { paths } from './types';

const API_BASE = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3001';

export type LookListResponse = paths['/api/looks']['get']['responses'][200]['content']['application/json'];
export type LookDetailResponse = paths['/api/looks/{id}']['get']['responses'][200]['content']['application/json'];
export type ProductListResponse = paths['/api/products']['get']['responses'][200]['content']['application/json'];
export type ProductDetailResponse = paths['/api/products/{id}']['get']['responses'][200]['content']['application/json'];
export type CreateOrderBody = paths['/api/orders']['post']['requestBody']['content']['application/json'];
export type OrderResponse = paths['/api/orders']['post']['responses'][201]['content']['application/json'];

export async function fetchLooks(): Promise<LookListResponse> {
  const res = await fetch(`${API_BASE}/api/looks`);
  if (!res.ok) throw new Error('Failed to fetch looks');
  return res.json();
}

export async function fetchLookById(id: number): Promise<LookDetailResponse> {
  const res = await fetch(`${API_BASE}/api/looks/${id}`);
  if (!res.ok) throw new Error(`Failed to fetch look ${id}`);
  return res.json();
}

export async function fetchProducts(params?: {
  category?: string;
  lookId?: number;
  page?: number;
  limit?: number;
}): Promise<ProductListResponse> {
  const query = new URLSearchParams();
  if (params?.category) query.set('category', params.category);
  if (params?.lookId !== undefined) query.set('lookId', String(params.lookId));
  if (params?.page) query.set('page', String(params.page));
  if (params?.limit) query.set('limit', String(params.limit));

  const res = await fetch(`${API_BASE}/api/products?${query.toString()}`);
  if (!res.ok) throw new Error('Failed to fetch products');
  return res.json();
}

export async function fetchProductById(id: string): Promise<ProductDetailResponse> {
  const res = await fetch(`${API_BASE}/api/products/${id}`);
  if (!res.ok) throw new Error(`Failed to fetch product ${id}`);
  return res.json();
}

export async function createOrder(data: CreateOrderBody): Promise<OrderResponse> {
  const res = await fetch(`${API_BASE}/api/orders`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(data),
  });
  if (!res.ok) {
    const errorData = await res.json().catch(() => ({}));
    throw new Error(errorData.message || 'Failed to place order');
  }
  return res.json();
}

