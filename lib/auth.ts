// Store user object in localStorage
import type { User } from "./types";

export const setUser = (user: User) => {
  localStorage.setItem("user", JSON.stringify(user));
  // Save permissions separately for easy access
  if (user && user.permissions) {
    localStorage.setItem(
      "permissions",
      typeof user.permissions === "string"
        ? user.permissions
        : JSON.stringify(user.permissions),
    );
  }
};

// Get user object from localStorage
export const getUser = (): User | null => {
  if (typeof window === "undefined") return null;
  const userStr = localStorage.getItem("user");
  if (!userStr) return null;
  try {
    return JSON.parse(userStr);
  } catch {
    return null;
  }
};
export const logout = () => {
  // Clear localStorage
  localStorage.removeItem("accessToken");
  localStorage.removeItem("refreshToken");
  localStorage.removeItem("token");
  localStorage.removeItem("userId");
  localStorage.removeItem("employeeId");
  localStorage.removeItem("username");
  localStorage.removeItem("fullName");
  localStorage.removeItem("email");

  // Clear cookies
  document.cookie =
    "accessToken=; path=/; expires=Thu, 01 Jan 1970 00:00:00 GMT";
  document.cookie =
    "refreshToken=; path=/; expires=Thu, 01 Jan 1970 00:00:00 GMT";
  document.cookie = "token=; path=/; expires=Thu, 01 Jan 1970 00:00:00 GMT";

  // Redirect to login
  window.location.href = "/auth/login";
};

export const getAccessToken = (): string | null => {
  if (typeof window === "undefined") return null;
  return localStorage.getItem("accessToken") || localStorage.getItem("token");
};

export const getRefreshToken = (): string | null => {
  if (typeof window === "undefined") return null;
  return localStorage.getItem("refreshToken");
};

export const isAuthenticated = (): boolean => {
  return !!getAccessToken();
};
