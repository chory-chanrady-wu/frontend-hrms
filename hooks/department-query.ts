import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { departmentsApi } from "@/lib/api";

const DEPT_KEYS = {
  all: ["departments"] as const,
  lists: () => [...DEPT_KEYS.all, "list"] as const,
  list: (filters: string) => [...DEPT_KEYS.lists(), { filters }] as const,
  details: () => [...DEPT_KEYS.all, "detail"] as const,
  detail: (id: number) => [...DEPT_KEYS.details(), id] as const,
  byName: (name: string) => [...DEPT_KEYS.all, "name", name] as const,
};

export const useGetAllDepartments = () => {
  return useQuery({
    queryKey: DEPT_KEYS.lists(),
    queryFn: () => departmentsApi.getAllDepartments(),
    staleTime: 0,
    refetchOnMount: true,
    refetchOnWindowFocus: true,
  });
};

export const useGetDepartmentById = (id: number) => {
  return useQuery({
    queryKey: DEPT_KEYS.detail(id),
    queryFn: () => departmentsApi.getDepartmentById(id),
    staleTime: 0,
    refetchOnMount: true,
    refetchOnWindowFocus: true,
    enabled: !!id,
  });
};

export const useGetDepartmentByName = (name: string) => {
  return useQuery({
    queryKey: DEPT_KEYS.byName(name),
    queryFn: () => departmentsApi.getDepartmentByName(name),
    staleTime: 0,
    refetchOnMount: true,
    refetchOnWindowFocus: true,
    enabled: !!name,
  });
};

export const useCreateDepartment = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (deptData: {
      name: string;
      description: string;
      headOfDepartmentId?: number | null;
    }) => departmentsApi.createDepartment(deptData),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: DEPT_KEYS.lists() });
    },
  });
};

export const useUpdateDepartment = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: ({
      id,
      deptData,
    }: {
      id: number;
      deptData: {
        name: string;
        description: string;
        headOfDepartmentId?: number | null;
      };
    }) => departmentsApi.updateDepartment(id, deptData),
    onSuccess: (_data: any, { id }: any) => {
      queryClient.invalidateQueries({ queryKey: DEPT_KEYS.detail(id) });
      queryClient.invalidateQueries({ queryKey: DEPT_KEYS.lists() });
    },
  });
};

export const useDeleteDepartment = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (id: number) => departmentsApi.deleteDepartment(id),
    onSuccess: (_data: any, id: any) => {
      queryClient.invalidateQueries({ queryKey: DEPT_KEYS.detail(id) });
      queryClient.invalidateQueries({ queryKey: DEPT_KEYS.lists() });
    },
  });
};

export const useDepartmentManagement = (deptId?: number) => {
  const query = useGetAllDepartments();
  const singleDeptQuery = useGetDepartmentById(deptId || 0);
  const createDept = useCreateDepartment();
  const updateDept = useUpdateDepartment();
  const deleteDept = useDeleteDepartment();

  return {
    allDepartments: query.data?.data || [],
    isLoadingAllDepartments: query.isLoading,
    singleDepartment: singleDeptQuery.data?.data,
    isLoadingSingleDepartment: singleDeptQuery.isLoading,
    createDepartment: createDept,
    updateDepartment: updateDept,
    deleteDepartment: deleteDept,
    isLoading: query.isLoading || singleDeptQuery.isLoading,
  };
};
