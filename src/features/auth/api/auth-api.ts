import { client } from "@/lib/fetcher";
import type { UserData } from "@/types/auth";

export type OtpType = "registration" | "reset_password";

export const authApi = {
  getCurrentUser: () => client.get<UserData>("/api/auth/me"),
  register: (
    name: string,
    email: string,
    handle: string,
    password: string,
    password_confirmation?: string
  ) =>
    client.post("/api/auth/register", {
      name,
      email,
      handle,
      password,
      password_confirmation: password_confirmation ?? password,
    }),
  verifyOtp: (email: string, otp: string, type: OtpType = "registration") =>
    client.post("/api/auth/otp/verify", { email, otp, type }),
  resendOtp: (email: string, type: OtpType = "registration") =>
    client.post("/api/auth/otp/resend", { email, type }),
  forgotPassword: (email: string) =>
    client.post("/api/auth/forgot-password", { email }),
  resetPassword: (
    email: string,
    otp: string,
    password: string,
    password_confirmation?: string
  ) =>
    client.post("/api/auth/reset-password", {
      email,
      otp,
      password,
      password_confirmation: password_confirmation ?? password,
    }),
  login: (email: string, password: string) =>
    client.post("/api/auth/login", { email, password }),
  logout: () => client.post("/api/auth/logout"),
};
