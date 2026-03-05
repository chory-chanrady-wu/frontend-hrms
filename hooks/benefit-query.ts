import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { benefitsApi, employeeBenefitsApi } from "@/lib/api";

// Benefits Keys
const BEN_KEYS = {
  all: ["benefits"] as const,
  lists: () => [...BEN_KEYS.all, "list"] as const,
  list: (filters: string) => [...BEN_KEYS.lists(), { filters }] as const,
  details: () => [...BEN_KEYS.all, "detail"] as const,
  detail: (id: number) => [...BEN_KEYS.details(), id] as const,
  byName: (name: string) => [...BEN_KEYS.all, "name", name] as const,
};

// Employee Benefits Keys
const EMP_BEN_KEYS = {
  all: ["employeeBenefits"] as const,
  lists: () => [...EMP_BEN_KEYS.all, "list"] as const,
  list: (filters: string) => [...EMP_BEN_KEYS.lists(), { filters }] as const,
  details: () => [...EMP_BEN_KEYS.all, "detail"] as const,
  detail: (id: number) => [...EMP_BEN_KEYS.details(), id] as const,
  byEmployee: (empId: number) =>
    [...EMP_BEN_KEYS.all, "employee", empId] as const,
};

// ==================== BENEFITS ====================

export const useGetAllBenefits = () => {
  return useQuery({
    queryKey: BEN_KEYS.lists(),
    queryFn: () => benefitsApi.getAllBenefits(),
    staleTime: 5 * 60 * 1000,
  });
};

export const useGetBenefitById = (id: number) => {
  return useQuery({
    queryKey: BEN_KEYS.detail(id),
    queryFn: () => benefitsApi.getBenefitById(id),
    staleTime: 5 * 60 * 1000,
    enabled: !!id,
  });
};

export const useGetBenefitByName = (name: string) => {
  return useQuery({
    queryKey: BEN_KEYS.byName(name),
    queryFn: () => benefitsApi.getBenefitByName(name),
    staleTime: 5 * 60 * 1000,
    enabled: !!name,
  });
};

export const useCreateBenefit = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (benData: {
      name: string;
      description: string;
      amount: number;
    }) => benefitsApi.createBenefit(benData),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: BEN_KEYS.lists() });
    },
  });
};

export const useUpdateBenefit = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: ({
      id,
      benData,
    }: {
      id: number;
      benData: { name: string; description: string; amount: number };
    }) => benefitsApi.updateBenefit(id, benData),
    onSuccess: (_data: any, { id }: any) => {
      queryClient.invalidateQueries({ queryKey: BEN_KEYS.detail(id) });
      queryClient.invalidateQueries({ queryKey: BEN_KEYS.lists() });
    },
  });
};

export const useDeleteBenefit = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (id: number) => benefitsApi.deleteBenefit(id),
    onSuccess: (_data: any, id: any) => {
      queryClient.invalidateQueries({ queryKey: BEN_KEYS.detail(id) });
      queryClient.invalidateQueries({ queryKey: BEN_KEYS.lists() });
    },
  });
};

// ==================== EMPLOYEE BENEFITS ====================

export const useGetAllEmployeeBenefits = () => {
  return useQuery({
    queryKey: EMP_BEN_KEYS.lists(),
    queryFn: () => employeeBenefitsApi.getAllEmployeeBenefits(),
    staleTime: 5 * 60 * 1000,
  });
};

export const useGetEmployeeBenefitById = (id: number) => {
  return useQuery({
    queryKey: EMP_BEN_KEYS.detail(id),
    queryFn: () => employeeBenefitsApi.getEmployeeBenefitById(id),
    staleTime: 5 * 60 * 1000,
    enabled: !!id,
  });
};

export const useGetEmployeeBenefitsByEmployee = (employeeId: number) => {
  return useQuery({
    queryKey: EMP_BEN_KEYS.byEmployee(employeeId),
    queryFn: () =>
      employeeBenefitsApi.getEmployeeBenefitsByEmployee(employeeId),
    staleTime: 5 * 60 * 1000,
    enabled: !!employeeId,
  });
};

export const useCreateEmployeeBenefit = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (ebData: {
      employeeId: number;
      benefitId: number;
      amount: number;
    }) => employeeBenefitsApi.createEmployeeBenefit(ebData),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: EMP_BEN_KEYS.lists() });
    },
  });
};

export const useUpdateEmployeeBenefit = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: ({
      id,
      ebData,
    }: {
      id: number;
      ebData: {
        employeeId: number;
        benefitId: number;
        amount: number;
      };
    }) => employeeBenefitsApi.updateEmployeeBenefit(id, ebData),
    onSuccess: (_data: any, { id }: any) => {
      queryClient.invalidateQueries({ queryKey: EMP_BEN_KEYS.detail(id) });
      queryClient.invalidateQueries({ queryKey: EMP_BEN_KEYS.lists() });
    },
  });
};

export const useDeleteEmployeeBenefit = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (id: number) => employeeBenefitsApi.deleteEmployeeBenefit(id),
    onSuccess: (_data: any, id: any) => {
      queryClient.invalidateQueries({ queryKey: EMP_BEN_KEYS.detail(id) });
      queryClient.invalidateQueries({ queryKey: EMP_BEN_KEYS.lists() });
    },
  });
};

// ==================== MANAGEMENT HOOKS ====================

export const useBenefitManagement = (benId?: number) => {
  const query = useGetAllBenefits();
  const singleBenQuery = useGetBenefitById(benId || 0);
  const createBen = useCreateBenefit();
  const updateBen = useUpdateBenefit();
  const deleteBen = useDeleteBenefit();

  return {
    allBenefits: query.data?.data || [],
    isLoadingAllBenefits: query.isLoading,
    singleBenefit: singleBenQuery.data?.data,
    isLoadingSingleBenefit: singleBenQuery.isLoading,
    createBenefit: createBen,
    updateBenefit: updateBen,
    deleteBenefit: deleteBen,
    isLoading: query.isLoading || singleBenQuery.isLoading,
  };
};

export const useEmployeeBenefitManagement = (ebId?: number) => {
  const query = useGetAllEmployeeBenefits();
  const singleEbQuery = useGetEmployeeBenefitById(ebId || 0);
  const createEb = useCreateEmployeeBenefit();
  const updateEb = useUpdateEmployeeBenefit();
  const deleteEb = useDeleteEmployeeBenefit();

  return {
    allEmployeeBenefits: query.data?.data || [],
    isLoadingAllEmployeeBenefits: query.isLoading,
    singleEmployeeBenefit: singleEbQuery.data?.data,
    isLoadingSingleEmployeeBenefit: singleEbQuery.isLoading,
    createEmployeeBenefit: createEb,
    updateEmployeeBenefit: updateEb,
    deleteEmployeeBenefit: deleteEb,
    isLoading: query.isLoading || singleEbQuery.isLoading,
  };
};
