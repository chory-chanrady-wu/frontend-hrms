import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { positionsApi } from "@/lib/api";

const POS_KEYS = {
  all: ["positions"] as const,
  lists: () => [...POS_KEYS.all, "list"] as const,
  list: (filters: string) => [...POS_KEYS.lists(), { filters }] as const,
  details: () => [...POS_KEYS.all, "detail"] as const,
  detail: (id: number) => [...POS_KEYS.details(), id] as const,
  byDept: (deptId: number) => [...POS_KEYS.all, "department", deptId] as const,
};

export const useGetAllPositions = () => {
  return useQuery({
    queryKey: POS_KEYS.lists(),
    queryFn: () => positionsApi.getAllPositions(),
    staleTime: 5 * 60 * 1000,
  });
};

export const useGetPositionById = (id: number) => {
  return useQuery({
    queryKey: POS_KEYS.detail(id),
    queryFn: () => positionsApi.getPositionById(id),
    staleTime: 5 * 60 * 1000,
    enabled: !!id,
  });
};

export const useGetPositionsByDepartment = (departmentId: number) => {
  return useQuery({
    queryKey: POS_KEYS.byDept(departmentId),
    queryFn: () => positionsApi.getPositionsByDepartment(departmentId),
    staleTime: 5 * 60 * 1000,
    enabled: !!departmentId,
  });
};

export const useCreatePosition = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (posData: {
      positionName: string;
      description: string;
      department: number;
      salary: number;
    }) => positionsApi.createPosition(posData),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: POS_KEYS.lists() });
    },
  });
};

export const useUpdatePosition = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: ({
      id,
      posData,
    }: {
      id: number;
      posData: {
        positionName: string;
        description: string;
        department: number;
        salary: number;
      };
    }) => positionsApi.updatePosition(id, posData),
    onSuccess: (
      _data: unknown,
      variables: {
        id: number;
        posData: {
          positionName: string;
          description: string;
          department: number;
          salary: number;
        };
      },
    ) => {
      queryClient.invalidateQueries({
        queryKey: POS_KEYS.detail(variables.id),
      });
      queryClient.invalidateQueries({ queryKey: POS_KEYS.lists() });
    },
  });
};

export const useDeletePosition = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (id: number) => positionsApi.deletePosition(id),
    onSuccess: (_data: unknown, id: number) => {
      queryClient.invalidateQueries({ queryKey: POS_KEYS.detail(id) });
      queryClient.invalidateQueries({ queryKey: POS_KEYS.lists() });
    },
  });
};

export const usePositionManagement = (posId?: number) => {
  const query = useGetAllPositions();
  const singlePosQuery = useGetPositionById(posId || 0);
  const createPos = useCreatePosition();
  const updatePos = useUpdatePosition();
  const deletePos = useDeletePosition();

  return {
    allPositions: query.data?.data || [],
    isLoadingAllPositions: query.isLoading,
    singlePosition: singlePosQuery.data?.data,
    isLoadingSinglePosition: singlePosQuery.isLoading,
    createPosition: createPos,
    updatePosition: updatePos,
    deletePosition: deletePos,
    isLoading: query.isLoading || singlePosQuery.isLoading,
  };
};
