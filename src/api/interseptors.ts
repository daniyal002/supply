import {
  getAccessToken,
  getRefreshToken,
  removeAccessTokenFromStorage,
  removeRefreshTokenFromStorage,
  saveAccessToken,
} from "@/services/auth-token.service";
import { authService } from "@/services/auth.service";
import { message } from "antd";
import axios, { type CreateAxiosDefaults } from "axios";

const options: CreateAxiosDefaults = {
  baseURL: process.env.NEXT_PUBLIC_API_URL || "http://192.168.30.153:8000",
  headers: {
    "Content-Type": "application/json",
  },
  // withCredentials: true
};

const axiosClassic = axios.create(options);
const axiosWidthAuth = axios.create(options);
const axiosOneC = axios.create(options);

axiosWidthAuth.interceptors.request.use((config) => {
  const accessToken = getAccessToken();
  if (config?.headers && accessToken) {
    config.headers.Authorization = `Bearer ${accessToken}`;
  }
  return config;
});

axiosOneC.interceptors.request.use((config) => {
  config.auth = { username: "WebUsr", password: "112233" };
  config.baseURL = "http://192.168.30.216/UNF_Test/hs/InventoryAccounting";
  return config;
});

axiosWidthAuth.interceptors.response.use(
  (response) => response,
  async (error) => {
    const originalRequest = error.config;

    // Обработка таймаута соединения
    if (error.code === "ERR_NETWORK") {
      message.error(
        "Ошибка: нет связи с сервером, обратитесь в тех. поддержку"
      );
      return Promise.reject(error);
    }

    // Проверяем статус 401 или 403
    if (
      (error?.response?.status === 401) &&
      !originalRequest._isRetry
    ) {
      originalRequest._isRetry = true;
      const refreshToken = getRefreshToken();
      if (!refreshToken) {
        // Если refresh-токен отсутствует, удаляем токены и перенаправляем на страницу входа
        removeAccessTokenFromStorage();
        removeRefreshTokenFromStorage();
        return window.location.replace("/login");
      }

      try {
        // Пытаемся обновить токен
        const { access_token } = await authService.refresh({
          refresh_token: refreshToken as string,
        });
        saveAccessToken(access_token);

        // Повторяем оригинальный запрос с новым access-токеном
        return axiosWidthAuth(originalRequest);
      } catch (refreshError) {
        console.error("Error during token refresh:", refreshError);
        removeAccessTokenFromStorage();
        removeRefreshTokenFromStorage();
        return window.location.replace("/login");
      }
    }

    // Если это не ошибка 401 или 403, просто отклоняем ошибку
    return Promise.reject(error);
  }
);

// axiosClassic.interceptors.response.use(
//     (response) =>response,
//     async (error) => {
//         if (error.code === "ERR_NETWORK") {
//             message.error("Ошибка: нет связи с сервером, обратитесь в тех. поддержку")
//           return Promise.reject(error);
//         }
//     }
// )
export { axiosClassic, axiosWidthAuth, axiosOneC };
