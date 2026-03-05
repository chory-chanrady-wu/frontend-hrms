import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { employeesApi } from "@/lib/api";

const EMP_KEYS = {
  all: ["employees"] as const,
  lists: () => [...EMP_KEYS.all, "list"] as const,
  list: (filters: string) => [...EMP_KEYS.lists(), { filters }] as const,
  details: () => [...EMP_KEYS.all, "detail"] as const,
  detail: (id: number) => [...EMP_KEYS.details(), id] as const,
  byDept: (deptId: number) => [...EMP_KEYS.all, "department", deptId] as const,
  byStatus: (status: string) => [...EMP_KEYS.all, "status", status] as const,
};

export const useGetAllEmployees = () => {
  return useQuery({
    queryKey: EMP_KEYS.lists(),
    queryFn: () => employeesApi.getAllEmployees(),
    staleTime: 5 * 60 * 1000,
  });
};

export const useGetEmployeeById = (id: number) => {
  return useQuery({
    queryKey: EMP_KEYS.detail(id),
    queryFn: () => employeesApi.getEmployeeById(id),
    staleTime: 5 * 60 * 1000,
    enabled: !!id,
  });
};

export const useGetEmployeesByDepartment = (departmentId: number) => {
  return useQuery({
    queryKey: EMP_KEYS.byDept(departmentId),
    queryFn: () => employeesApi.getEmployeesByDepartment(departmentId),
    staleTime: 5 * 60 * 1000,
    enabled: !!departmentId,
  });
};

export const useGetEmployeesByStatus = (status: string) => {
  return useQuery({
    queryKey: EMP_KEYS.byStatus(status),
    queryFn: () => employeesApi.getEmployeesByStatus(status),
    staleTime: 5 * 60 * 1000,
    enabled: !!status,
  });
};

export const useCreateEmployee = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (empData: {
      userId: number;
      departmentId: number;
      jobTitle: string;
      employmentType: string;
      salary: number;
      hireDate: string;
      status: string;
    }) => employeesApi.createEmployee(empData),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: EMP_KEYS.lists() });
    },
  });
};

export const useUpdateEmployee = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: ({
      id,
      empData,
    }: {
      id: number;
      empData: {
        userId: number;
        departmentId: number;
        jobTitle: string;
        employmentType: string;
        salary: number;
        hireDate: string;
        status: string;
      };
    }) => employeesApi.updateEmployee(id, empData),
    onSuccess: (_data: any, { id }: any) => {
      queryClient.invalidateQueries({ queryKey: EMP_KEYS.detail(id) });
      queryClient.invalidateQueries({ queryKey: EMP_KEYS.lists() });
    },
  });
};

export const useDeleteEmployee = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (id: number) => employeesApi.deleteEmployee(id),
    onSuccess: (_data: any, id: any) => {
      queryClient.invalidateQueries({ queryKey: EMP_KEYS.detail(id) });
      queryClient.invalidateQueries({ queryKey: EMP_KEYS.lists() });
    },
  });
};

export const useUploadEmployeeImage = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: ({ id, file }: { id: number; file: File }) =>
      employeesApi.uploadEmployeeImage(id, file),
    onSuccess: (_data: any, { id }: any) => {
      queryClient.invalidateQueries({ queryKey: EMP_KEYS.detail(id) });
    },
  });
};

export const useEmployeeManagement = (empId?: number) => {
  const query = useGetAllEmployees();
  const singleEmpQuery = useGetEmployeeById(empId || 0);
  const createEmp = useCreateEmployee();
  const updateEmp = useUpdateEmployee();
  const deleteEmp = useDeleteEmployee();
  const uploadImage = useUploadEmployeeImage();

  return {
    allEmployees: query.data?.data || [],
    isLoadingAllEmployees: query.isLoading,
    singleEmployee: singleEmpQuery.data?.data,
    isLoadingSingleEmployee: singleEmpQuery.isLoading,
    createEmployee: createEmp,
    updateEmployee: updateEmp,
    deleteEmployee: deleteEmp,
    uploadEmployeeImage: uploadImage,
    isLoading: query.isLoading || singleEmpQuery.isLoading,
  };
};
