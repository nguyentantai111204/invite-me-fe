import { httpClient, IApiResponse } from "./http-client";
import { ITemplate } from "@/interfaces/invitation.interface";

export const templatesApi = {
  // Lấy danh sách tất cả các mẫu thiệp có sẵn
  getAll: async (category?: string): Promise<ITemplate[]> => {
    const params = category && category !== "Tất cả" ? { category } : {};
    const res = await httpClient.get<unknown, IApiResponse<ITemplate[]>>("/templates", { params });
    return res.data;
  },

  // Xem chi tiết mẫu thiệp theo Slug hoặc ID
  getBySlug: async (slug: string): Promise<ITemplate> => {
    const res = await httpClient.get<unknown, IApiResponse<ITemplate>>(`/templates/${slug}`);
    return res.data;
  },
};
