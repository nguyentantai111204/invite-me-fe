import useSWR from "swr";
import { invitationsApi } from "@/services/api";
import { IInvitation } from "@/interfaces/invitation.interface";

export const useInvitation = (id?: string) => {
  const { data, error, isLoading, mutate } = useSWR<IInvitation>(
    id ? `invitation-detail-${id}` : null,
    () => invitationsApi.getById(id!),
    {
      revalidateOnFocus: false,
    }
  );

  return {
    invitation: data,
    isLoading,
    isError: !!error,
    error,
    mutate,
  };
};
