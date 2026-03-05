import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { rolesApi } from "@/lib/api";

const ROLE_KEYS = {
  all: ["roles"] as const,
  lists: () => [...ROLE_KEYS.all, "list"] as const,
  list: (filters: string) => [...ROLE_KEYS.lists(), { filters }] as const,
  details: () => [...ROLE_KEYS.all, "detail"] as const,
  detail: (id: number) => [...ROLE_KEYS.details(), id] as const,
  byName: (name: string) => [...ROLE_KEYS.all, "name", name] as const,
};

export const useGetAllRoles = () => {
  return useQuery({
    queryKey: ROLE_KEYS.lists(),
    queryFn: () => rolesApi.getAllRoles(),
    staleTime: 5 * 60 * 1000,
  });
};

export const useGetRoleById = (id: number) => {
  return useQuery({
    queryKey: ROLE_KEYS.detail(id),
    queryFn: () => rolesApi.getRoleById(id),
    staleTime: 5 * 60 * 1000,
    enabled: !!id,
  });
};

export const useGetRoleByName = (name: string) => {
  return useQuery({
    queryKey: ROLE_KEYS.byName(name),
    queryFn: () => rolesApi.getRoleByName(name),
    staleTime: 5 * 60 * 1000,
    enabled: !!name,
  });
};

export const useCreateRole = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (roleData: { roleName: string; permissions: string }) =>
      rolesApi.createRole(roleData),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ROLE_KEYS.lists() });
    },
  });
};

export const useUpdateRole = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: ({
      id,
      roleData,
    }: {
      id: number;
      roleData: { roleName: string; permissions: string };
    }) => rolesApi.updateRole(id, roleData),
    onSuccess: (data, { id }) => {
      queryClient.invalidateQueries({ queryKey: ROLE_KEYS.detail(id) });
      queryClient.invalidateQueries({ queryKey: ROLE_KEYS.lists() });
    },
  });
};

export const useDeleteRole = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (id: number) => rolesApi.deleteRole(id),
    onSuccess: (data, id) => {
      queryClient.invalidateQueries({ queryKey: ROLE_KEYS.detail(id) });
      queryClient.invalidateQueries({ queryKey: ROLE_KEYS.lists() });
    },
  });
};

export const useRoleManagement = (roleId?: number) => {
  const query = useGetAllRoles();
  const singleRoleQuery = useGetRoleById(roleId || 0);
  const createRole = useCreateRole();
  const updateRole = useUpdateRole();
  const deleteRole = useDeleteRole();

  return {
    allRoles: query.data?.data || [],
    isLoadingAllRoles: query.isLoading,
    singleRole: singleRoleQuery.data?.data,
    isLoadingSingleRole: singleRoleQuery.isLoading,
    createRole,
    updateRole,
    deleteRole,
    isLoading:
      query.isLoading || singleRoleQuery.isLoading || createRole.isPending,
  };
};
