import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { auditLogsApi } from "@/lib/api";

const AL_KEYS = {
  all: ["auditLogs"] as const,
  lists: () => [...AL_KEYS.all, "list"] as const,
  list: (filters: string) => [...AL_KEYS.lists(), { filters }] as const,
  details: () => [...AL_KEYS.all, "detail"] as const,
  detail: (id: number) => [...AL_KEYS.details(), id] as const,
  byUser: (userId: number) => [...AL_KEYS.all, "user", userId] as const,
  byTable: (tableName: string) => [...AL_KEYS.all, "table", tableName] as const,
  byAction: (action: string) => [...AL_KEYS.all, "action", action] as const,
};

export const useGetAllAuditLogs = () => {
  return useQuery({
    queryKey: AL_KEYS.lists(),
    queryFn: () => auditLogsApi.getAllAuditLogs(),
    staleTime: 5 * 60 * 1000,
  });
};

export const useGetAuditLogById = (id: number) => {
  return useQuery({
    queryKey: AL_KEYS.detail(id),
    queryFn: () => auditLogsApi.getAuditLogById(id),
    staleTime: 5 * 60 * 1000,
    enabled: !!id,
  });
};

export const useGetAuditLogsByUser = (userId: number) => {
  return useQuery({
    queryKey: AL_KEYS.byUser(userId),
    queryFn: () => auditLogsApi.getAuditLogsByUser(userId),
    staleTime: 5 * 60 * 1000,
    enabled: !!userId,
  });
};

export const useGetAuditLogsByTable = (tableName: string) => {
  return useQuery({
    queryKey: AL_KEYS.byTable(tableName),
    queryFn: () => auditLogsApi.getAuditLogsByTable(tableName),
    staleTime: 5 * 60 * 1000,
    enabled: !!tableName,
  });
};

export const useGetAuditLogsByAction = (action: string) => {
  return useQuery({
    queryKey: AL_KEYS.byAction(action),
    queryFn: () => auditLogsApi.getAuditLogsByAction(action),
    staleTime: 5 * 60 * 1000,
    enabled: !!action,
  });
};

export const useCreateAuditLog = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (alData: {
      userId: number;
      action: string;
      tableName: string;
      recordId: number;
      changes: string;
    }) => auditLogsApi.createAuditLog(alData),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: AL_KEYS.lists() });
    },
  });
};

export const useAuditLogManagement = (alId?: number) => {
  const query = useGetAllAuditLogs();
  const singleAlQuery = useGetAuditLogById(alId || 0);
  const createAl = useCreateAuditLog();

  return {
    allAuditLogs: query.data?.data || [],
    isLoadingAllAuditLogs: query.isLoading,
    singleAuditLog: singleAlQuery.data?.data,
    isLoadingSingleAuditLog: singleAlQuery.isLoading,
    createAuditLog: createAl,
    isLoading: query.isLoading || singleAlQuery.isLoading,
  };
};
