import { httpClient, IApiResponse } from "./http-client";

export interface IAuthUser {
  id: string;
  email: string;
  fullName: string;
  avatarUrl?: string;
  role: string;
}

export interface IAuthResponse {
  accessToken: string;
  user: IAuthUser;
}

export const authApi = {
  register: async (dto: { email: string; password: string; fullName: string }): Promise<IAuthResponse> => {
    const res = await httpClient.post<unknown, IApiResponse<IAuthResponse>>("/auth/register", dto);
    if (res.data.accessToken && typeof window !== "undefined") {
      localStorage.setItem("access_token", res.data.accessToken);
    }
    return res.data;
  },

  login: async (dto: { email: string; password: string }): Promise<IAuthResponse> => {
    const res = await httpClient.post<unknown, IApiResponse<IAuthResponse>>("/auth/login", dto);
    if (res.data.accessToken && typeof window !== "undefined") {
      localStorage.setItem("access_token", res.data.accessToken);
    }
    return res.data;
  },

  getMe: async (): Promise<IAuthUser> => {
    const res = await httpClient.get<unknown, IApiResponse<IAuthUser>>("/users/me");
    return res.data;
  },

  logout: async (): Promise<void> => {
    try {
      await httpClient.post("/auth/logout");
    } finally {
      if (typeof window !== "undefined") {
        localStorage.removeItem("access_token");
      }
    }
  },
};
