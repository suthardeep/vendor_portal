import axios, { AxiosInstance, AxiosRequestConfig } from "axios";
import * as Sentry from "@sentry/react";
import { logError } from "../../logger/logger";
import { TokenUtil } from "../utils/tokenUtil";

/**
 * Base API URL (from env)
 */
const API_BASE_URL = import.meta.env.VITE_BACKEND_URL || "https://api.example.com";

/**
 * Function to create an Axios instance with interceptors
 */
const createApiInstance = (): AxiosInstance => {
  const api = axios.create({
    baseURL: API_BASE_URL,
    withCredentials: true,
    headers: { "Content-Type": "application/json" },
  });

  /**
   * Request interceptor - add token
   */
  api.interceptors.request.use(
    (config) => {
      const token = TokenUtil.getToken?.();
      if (token) {
        config.headers = config.headers || {};
        config.headers.Authorization = `Bearer ${token}`;
      }
      return config;
    },
    (error) => {
      logError(error, { phase: "request" });
      Sentry.captureException(error);
      return Promise.reject(error);
    },
  );

  /**
   * Response interceptor - error handling
   */
  api.interceptors.response.use(
    (response) => response,
    (error) => {
      const status = error?.response?.status || 500;
      const errorMessage =
        error?.response?.data?.message ||
        error?.message ||
        "Network or server error";

      const errorData = {
        message: errorMessage,
        status,
        url: error?.config?.url,
        method: error?.config?.method?.toUpperCase(),
        data: error?.config?.data,
      };

      console.error("API Error:", errorData);
      logError(error, errorData);
      Sentry.captureException(error);

      return Promise.reject(errorData);
    },
  );

  return api;
};

const api = createApiInstance();

/**
 * Interface for defining request props
 */
interface ApiServiceProps {
  method: "GET" | "POST" | "PUT" | "PATCH" | "DELETE";
  endpoint: string;
  headers?: Record<string, string>;
  data?: any;
  params?: Record<string , string|number|boolean>;
  config?: AxiosRequestConfig;
}

/**
 * Main API Service Function (flexible + logged)
 */
const apiService = async <T>({
  method,
  endpoint,
  headers = {},
  data,
  params,
  config = {},
}: ApiServiceProps): Promise<T> => {
  try {
    const response = await api.request<T>({
      method,
      url: endpoint,
      headers,
      data,
      params,
      ...config,
    });
    return response.data;
  } catch (error: any) {
    throw error;
  }
};

export default apiService;
