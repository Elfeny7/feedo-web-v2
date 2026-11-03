import { client } from "@/lib/fetcher";
import type { UserData } from "@/types/auth";

export const authApi = {
  getCurrentUser: () => client.get<UserData>("/api/auth/me"),
  login: (email: string, password: string) =>
    client.post("/api/auth/login", { email, password }),
  logout: () => client.post("/api/auth/logout"),
};
