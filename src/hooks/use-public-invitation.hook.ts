import useSWR from "swr";
import { invitationsApi } from "@/services/api";
import { IInvitation } from "@/interfaces/invitation.interface";

export const usePublicInvitation = (slug?: string) => {
  const { data, error, isLoading, mutate } = useSWR<IInvitation>(
    slug ? `invitation-public-${slug}` : null,
    () => invitationsApi.getPublicBySlug(slug!),
    {
      revalidateOnFocus: false,
      shouldRetryOnError: false,
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
