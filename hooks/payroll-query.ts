import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { payrollApi } from "@/lib/api";

const PR_KEYS = {
  all: ["payroll"] as const,
  lists: () => [...PR_KEYS.all, "list"] as const,
  list: (filters: string) => [...PR_KEYS.lists(), { filters }] as const,
  details: () => [...PR_KEYS.all, "detail"] as const,
  detail: (id: number) => [...PR_KEYS.details(), id] as const,
  byEmployee: (empId: number) => [...PR_KEYS.all, "employee", empId] as const,
};

export const useGetAllPayroll = () => {
  return useQuery({
    queryKey: PR_KEYS.lists(),
    queryFn: () => payrollApi.getAllPayroll(),
    staleTime: 5 * 60 * 1000,
  });
};

export const useGetPayrollById = (id: number) => {
  return useQuery({
    queryKey: PR_KEYS.detail(id),
    queryFn: () => payrollApi.getPayrollById(id),
    staleTime: 5 * 60 * 1000,
    enabled: !!id,
  });
};

export const useGetPayrollByEmployee = (employeeId: number) => {
  return useQuery({
    queryKey: PR_KEYS.byEmployee(employeeId),
    queryFn: () => payrollApi.getPayrollByEmployee(employeeId),
    staleTime: 5 * 60 * 1000,
    enabled: !!employeeId,
  });
};

export const useCreatePayroll = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (prData: {
      employeeId: number;
      month: number;
      year: number;
      basicSalary: number;
      bonus: number;
      deductions: number;
      netSalary: number;
    }) => payrollApi.createPayroll(prData),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: PR_KEYS.lists() });
    },
  });
};

export const useUpdatePayroll = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: ({
      id,
      prData,
    }: {
      id: number;
      prData: {
        employeeId: number;
        month: number;
        year: number;
        basicSalary: number;
        bonus: number;
        deductions: number;
        netSalary: number;
      };
    }) => payrollApi.updatePayroll(id, prData),
    onSuccess: (_data: any, { id }: any) => {
      queryClient.invalidateQueries({ queryKey: PR_KEYS.detail(id) });
      queryClient.invalidateQueries({ queryKey: PR_KEYS.lists() });
    },
  });
};

export const useDeletePayroll = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (id: number) => payrollApi.deletePayroll(id),
    onSuccess: (_data: any, id: any) => {
      queryClient.invalidateQueries({ queryKey: PR_KEYS.detail(id) });
      queryClient.invalidateQueries({ queryKey: PR_KEYS.lists() });
    },
  });
};

export const usePayrollManagement = (prId?: number) => {
  const query = useGetAllPayroll();
  const singlePrQuery = useGetPayrollById(prId || 0);
  const createPr = useCreatePayroll();
  const updatePr = useUpdatePayroll();
  const deletePr = useDeletePayroll();

  return {
    allPayroll: query.data?.data || [],
    isLoadingAllPayroll: query.isLoading,
    singlePayroll: singlePrQuery.data?.data,
    isLoadingSinglePayroll: singlePrQuery.isLoading,
    createPayroll: createPr,
    updatePayroll: updatePr,
    deletePayroll: deletePr,
    isLoading: query.isLoading || singlePrQuery.isLoading,
  };
};
