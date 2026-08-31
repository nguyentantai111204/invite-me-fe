import axios, { AxiosInstance, AxiosRequestConfig, AxiosResponse, AxiosError } from "axios";
import { envConfig } from "@/config/env.config";

export interface IApiResponse<T = unknown> {
  success: boolean;
  data: T;
  message?: string;
  error?: {
    code: string;
    message: string;
    details?: unknown;
  };
}

const createHttpClient = (): AxiosInstance => {
  const instance = axios.create({
    baseURL: envConfig.apiUrl,
    timeout: 15000,
    headers: {
      "Content-Type": "application/json",
    },
    withCredentials: true,
  });

  // Request Interceptor: đính kèm Bearer token nếu có trong localStorage/cookie
  instance.interceptors.request.use(
    (config) => {
      if (typeof window !== "undefined") {
        const token = localStorage.getItem("access_token");
        if (token && config.headers) {
          config.headers.Authorization = `Bearer ${token}`;
        }
      }
      return config;
    },
    (error) => Promise.reject(error)
  );

  // Response Interceptor: chuẩn hóa payload và error
  instance.interceptors.response.use(
    (response: AxiosResponse<IApiResponse<unknown>>) => {
      // Nếu backend trả về format chuẩn { success: true, data: ... }
      if (response.data && typeof response.data === "object" && "success" in response.data) {
        return response.data as unknown as AxiosResponse;
      }
      return response.data as unknown as AxiosResponse;
    },
    (error: AxiosError<IApiResponse<unknown>>) => {
      const errorResponse = error.response?.data;
      const customMessage = errorResponse?.error?.message || error.message || "Đã có lỗi xảy ra";

      if (error.response?.status === 401 && typeof window !== "undefined") {
        localStorage.removeItem("access_token");
      }

      return Promise.reject(new Error(customMessage));
    }
  );

  return instance;
};

export const httpClient = createHttpClient();
