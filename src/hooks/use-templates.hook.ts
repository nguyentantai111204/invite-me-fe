import useSWR from "swr";
import { templatesApi } from "@/services/api";
import { ITemplate } from "@/interfaces/invitation.interface";

export const useTemplates = (category?: string) => {
  const { data, error, isLoading, mutate } = useSWR<ITemplate[]>(
    `templates-list-${category || "all"}`,
    () => templatesApi.getAll(category),
    {
      revalidateOnFocus: false,
    }
  );

  return {
    templates: data || [],
    isLoading,
    isError: !!error,
    error,
    mutate,
  };
};
