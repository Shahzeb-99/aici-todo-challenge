// src/utils/auth.ts
import {jwtDecode} from "jwt-decode";

export function isAuthenticated(): boolean {
  const token = localStorage.getItem("token");
  if (!token) return false;

  try {
    const { exp } = jwtDecode<{ exp: number }>(token);
    if (Date.now() >= exp * 1000) {
      localStorage.removeItem("token");
      return false;
    }
    return true;
  } catch {
    return false;
  }
}
