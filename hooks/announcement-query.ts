import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { announcementsApi } from "@/lib/api";

const ANNOUNCEMENT_KEYS = {
  all: ["announcements"] as const,
  lists: () => [...ANNOUNCEMENT_KEYS.all, "list"] as const,
  details: () => [...ANNOUNCEMENT_KEYS.all, "detail"] as const,
  detail: (id: number) => [...ANNOUNCEMENT_KEYS.details(), id] as const,
};

export const useGetAllAnnouncements = () => {
  return useQuery({
    queryKey: ANNOUNCEMENT_KEYS.lists(),
    queryFn: () => announcementsApi.getAllAnnouncements(),
    staleTime: 0,
    refetchOnMount: true,
    refetchOnWindowFocus: true,
  });
};

export const useGetAnnouncementById = (id: number) => {
  return useQuery({
    queryKey: ANNOUNCEMENT_KEYS.detail(id),
    queryFn: () => announcementsApi.getAnnouncementById(id),
    staleTime: 0,
    refetchOnMount: true,
    refetchOnWindowFocus: true,
    enabled: !!id,
  });
};

export const useCreateAnnouncement = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (data: {
      title: string;
      content: string;
      priority: string;
      publishedAt?: string;
      expiresAt?: string;
      createdById?: number;
    }) => announcementsApi.createAnnouncement(data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ANNOUNCEMENT_KEYS.lists() });
    },
  });
};

export const useUpdateAnnouncement = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: ({
      id,
      data,
    }: {
      id: number;
      data: {
        title: string;
        content: string;
        priority: string;
        publishedAt?: string;
        expiresAt?: string;
      };
    }) => announcementsApi.updateAnnouncement(id, data),
    onSuccess: (_data: any, { id }: any) => {
      queryClient.invalidateQueries({ queryKey: ANNOUNCEMENT_KEYS.detail(id) });
      queryClient.invalidateQueries({ queryKey: ANNOUNCEMENT_KEYS.lists() });
    },
  });
};

export const useDeleteAnnouncement = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (id: number) => announcementsApi.deleteAnnouncement(id),
    onSuccess: (_data: any, id: any) => {
      queryClient.invalidateQueries({ queryKey: ANNOUNCEMENT_KEYS.detail(id) });
      queryClient.invalidateQueries({ queryKey: ANNOUNCEMENT_KEYS.lists() });
    },
  });
};
