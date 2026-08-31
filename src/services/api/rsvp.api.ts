import { httpClient, IApiResponse } from "./http-client";
import { IRsvp, IRsvpSubmission } from "@/interfaces/invitation.interface";

export const rsvpApi = {
  // Khách mời gửi xác nhận tham dự tiệc cưới
  submitRsvp: async (invitationId: string, data: IRsvpSubmission): Promise<IRsvp> => {
    const res = await httpClient.post<unknown, IApiResponse<IRsvp>>("/rsvp", {
      invitationId,
      ...data,
    });
    return res.data;
  },

  // Lấy danh sách khách đã RSVP theo thiệp mời
  getByInvitationId: async (invitationId: string): Promise<IRsvp[]> => {
    const res = await httpClient.get<unknown, IApiResponse<IRsvp[]>>(`/rsvp/invitation/${invitationId}`);
    return res.data;
  },
};
