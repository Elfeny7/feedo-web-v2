import { backendClient, browserClient, baseFetcher } from "./base-fetcher";
import type { ResponseData, ApiError } from "@/types/api";

const BACKEND_URL = process.env.LARAVEL_API_URL || "";

export const backend = backendClient(BACKEND_URL);
export const client = browserClient();

export { ApiError, baseFetcher };
export type { ResponseData };