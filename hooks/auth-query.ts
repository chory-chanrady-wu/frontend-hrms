export type LoginResponse = {
  accessToken?: string;
  refreshToken?: string;
  token?: string;
  user?: {
    id?: number;
    employeeId?: number;
    username?: string;
    fullName?: string;
    email?: string;
    // add any other fields you use
  };
};
import { useMutation } from "@tanstack/react-query";
import { authApi, cloudinaryApi } from "@/lib/api";

// ==================== AUTH ====================

export const useLogin = () => {
  return useMutation<
    LoginResponse,
    Error,
    { email?: string; username?: string; password: string }
  >({
    mutationFn: (credentials) => authApi.login(credentials),
    onError: (error: Error) => {
      console.error("Login error:", error);
    },
  });
};

// ==================== CLOUDINARY ====================

export const useUploadImage = () => {
  return useMutation({
    mutationFn: (file: File) => cloudinaryApi.uploadImage(file),
    onError: (error: Error) => {
      console.error("Upload error:", error);
    },
  });
};

export const useVerifyCloudinaryConfig = () => {
  return useMutation({
    mutationFn: () => cloudinaryApi.verifyCloudinaryConfig(),
  });
};
