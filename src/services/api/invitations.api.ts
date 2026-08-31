import { httpClient, IApiResponse } from "./http-client";
import { IInvitation } from "@/interfaces/invitation.interface";

export const invitationsApi = {
  // Lấy dữ liệu công khai theo Slug (/i/[slug])
  getPublicBySlug: async (slug: string): Promise<IInvitation> => {
    const res = await httpClient.get<unknown, IApiResponse<IInvitation>>(`/invitations/public/${slug}`);
    return res.data;
  },

  // Lấy chi tiết thiệp cho dashboard / editor
  getById: async (id: string): Promise<IInvitation> => {
    const res = await httpClient.get<unknown, IApiResponse<IInvitation>>(`/invitations/${id}`);
    return res.data;
  },

  // Lấy danh sách thiệp của người dùng hiện tại
  getMyInvitations: async (): Promise<IInvitation[]> => {
    const res = await httpClient.get<unknown, IApiResponse<IInvitation[]>>("/invitations/me");
    return res.data;
  },

  // Tạo mới một thiệp mời
  create: async (dto: Partial<IInvitation>): Promise<IInvitation> => {
    const res = await httpClient.post<unknown, IApiResponse<IInvitation>>("/invitations", dto);
    return res.data;
  },

  // Cập nhật thiệp mời (Auto-save / Lưu thay đổi)
  update: async (id: string, dto: Partial<IInvitation>): Promise<IInvitation> => {
    const res = await httpClient.put<unknown, IApiResponse<IInvitation>>(`/invitations/${id}`, dto);
    return res.data;
  },

  // Xuất bản thiệp chính thức
  publish: async (id: string): Promise<IInvitation> => {
    const res = await httpClient.post<unknown, IApiResponse<IInvitation>>(`/invitations/${id}/publish`);
    return res.data;
  },

  // Xóa thiệp mời
  delete: async (id: string): Promise<{ success: boolean }> => {
    const res = await httpClient.delete<unknown, IApiResponse<{ success: boolean }>>(`/invitations/${id}`);
    return res.data;
  },

  // Claim Anonymous Draft vào tài khoản người dùng
  claimDraft: async (draftId: string): Promise<IInvitation> => {
    const res = await httpClient.post<unknown, IApiResponse<IInvitation>>("/invitations/claim-draft", { draftId });
    return res.data;
  },
};
