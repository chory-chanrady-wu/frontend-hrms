import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { leaveTypesApi, leaveRequestsApi } from "@/lib/api";

// Leave Types Keys
const LT_KEYS = {
  all: ["leaveTypes"] as const,
  lists: () => [...LT_KEYS.all, "list"] as const,
  list: (filters: string) => [...LT_KEYS.lists(), { filters }] as const,
  details: () => [...LT_KEYS.all, "detail"] as const,
  detail: (id: number) => [...LT_KEYS.details(), id] as const,
  byName: (name: string) => [...LT_KEYS.all, "name", name] as const,
};

// Leave Requests Keys
const LR_KEYS = {
  all: ["leaveRequests"] as const,
  lists: () => [...LR_KEYS.all, "list"] as const,
  list: (filters: string) => [...LR_KEYS.lists(), { filters }] as const,
  details: () => [...LR_KEYS.all, "detail"] as const,
  detail: (id: number) => [...LR_KEYS.details(), id] as const,
  byEmployee: (empId: number) => [...LR_KEYS.all, "employee", empId] as const,
  byStatus: (status: string) => [...LR_KEYS.all, "status", status] as const,
};

// ==================== LEAVE TYPES ====================

export const useGetAllLeaveTypes = () => {
  return useQuery({
    queryKey: LT_KEYS.lists(),
    queryFn: () => leaveTypesApi.getAllLeaveTypes(),
    staleTime: 0,
    refetchOnMount: true,
    refetchOnWindowFocus: true,
  });
};

export const useGetLeaveTypeById = (id: number) => {
  return useQuery({
    queryKey: LT_KEYS.detail(id),
    queryFn: () => leaveTypesApi.getLeaveTypeById(id),
    staleTime: 0,
    refetchOnMount: true,
    refetchOnWindowFocus: true,
    enabled: !!id,
  });
};

export const useGetLeaveTypeByName = (name: string) => {
  return useQuery({
    queryKey: LT_KEYS.byName(name),
    queryFn: () => leaveTypesApi.getLeaveTypeByName(name),
    staleTime: 0,
    refetchOnMount: true,
    refetchOnWindowFocus: true,
    enabled: !!name,
  });
};

export const useCreateLeaveType = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (ltData: {
      name: string;
      description: string;
      daysAllowed: number;
    }) => leaveTypesApi.createLeaveType(ltData),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: LT_KEYS.lists() });
    },
  });
};

export const useUpdateLeaveType = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: ({
      id,
      ltData,
    }: {
      id: number;
      ltData: { name: string; description: string; daysAllowed: number };
    }) => leaveTypesApi.updateLeaveType(id, ltData),
    onSuccess: (
      _data: unknown,
      variables: {
        id: number;
        ltData: { name: string; description: string; daysAllowed: number };
      },
    ) => {
      queryClient.invalidateQueries({ queryKey: LT_KEYS.detail(variables.id) });
      queryClient.invalidateQueries({ queryKey: LT_KEYS.lists() });
    },
  });
};

export const useDeleteLeaveType = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (id: number) => leaveTypesApi.deleteLeaveType(id),
    onSuccess: (_data: unknown, id: number) => {
      queryClient.invalidateQueries({ queryKey: LT_KEYS.detail(id) });
      queryClient.invalidateQueries({ queryKey: LT_KEYS.lists() });
    },
  });
};

// ==================== LEAVE REQUESTS ====================

export const useGetAllLeaveRequests = () => {
  return useQuery({
    queryKey: LR_KEYS.lists(),
    queryFn: () => leaveRequestsApi.getAllLeaveRequests(),
    staleTime: 5 * 60 * 1000,
  });
};

export const useGetLeaveRequestById = (id: number) => {
  return useQuery({
    queryKey: LR_KEYS.detail(id),
    queryFn: () => leaveRequestsApi.getLeaveRequestById(id),
    staleTime: 5 * 60 * 1000,
    enabled: !!id,
  });
};

export const useGetLeaveRequestsByEmployee = (employeeId: number) => {
  return useQuery({
    queryKey: LR_KEYS.byEmployee(employeeId),
    queryFn: () => leaveRequestsApi.getLeaveRequestsByEmployee(employeeId),
    staleTime: 5 * 60 * 1000,
    enabled: !!employeeId,
  });
};

export const useGetLeaveRequestsByStatus = (status: string) => {
  return useQuery({
    queryKey: LR_KEYS.byStatus(status),
    queryFn: () => leaveRequestsApi.getLeaveRequestsByStatus(status),
    staleTime: 5 * 60 * 1000,
    enabled: !!status,
  });
};

export const useCreateLeaveRequest = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (lrData: {
      employeeId: number;
      leaveTypeId: number;
      startDate: string;
      endDate: string;
      reason: string;
      status: string;
    }) => leaveRequestsApi.createLeaveRequest(lrData),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: LR_KEYS.lists() });
    },
  });
};

export const useUpdateLeaveRequest = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: ({
      id,
      lrData,
    }: {
      id: number;
      lrData: {
        employeeId: number;
        leaveTypeId: number;
        startDate: string;
        endDate: string;
        reason: string;
        status: string;
      };
    }) => leaveRequestsApi.updateLeaveRequest(id, lrData),
    onSuccess: (
      _data: unknown,
      variables: {
        id: number;
        lrData: {
          employeeId: number;
          leaveTypeId: number;
          startDate: string;
          endDate: string;
          reason: string;
          status: string;
        };
      },
    ) => {
      queryClient.invalidateQueries({ queryKey: LR_KEYS.detail(variables.id) });
      queryClient.invalidateQueries({ queryKey: LR_KEYS.lists() });
    },
  });
};

export const useDeleteLeaveRequest = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (id: number) => leaveRequestsApi.deleteLeaveRequest(id),
    onSuccess: (_data: unknown, id: number) => {
      queryClient.invalidateQueries({ queryKey: LR_KEYS.detail(id) });
      queryClient.invalidateQueries({ queryKey: LR_KEYS.lists() });
    },
  });
};

// ==================== MANAGEMENT HOOKS ====================

export const useLeaveTypeManagement = (ltId?: number) => {
  const query = useGetAllLeaveTypes();
  const singleLtQuery = useGetLeaveTypeById(ltId || 0);
  const createLt = useCreateLeaveType();
  const updateLt = useUpdateLeaveType();
  const deleteLt = useDeleteLeaveType();

  return {
    allLeaveTypes: query.data?.data || [],
    isLoadingAllLeaveTypes: query.isLoading,
    singleLeaveType: singleLtQuery.data?.data,
    isLoadingSingleLeaveType: singleLtQuery.isLoading,
    createLeaveType: createLt,
    updateLeaveType: updateLt,
    deleteLeaveType: deleteLt,
    isLoading: query.isLoading || singleLtQuery.isLoading,
  };
};

export const useLeaveRequestManagement = (lrId?: number) => {
  const query = useGetAllLeaveRequests();
  const singleLrQuery = useGetLeaveRequestById(lrId || 0);
  const createLr = useCreateLeaveRequest();
  const updateLr = useUpdateLeaveRequest();
  const deleteLr = useDeleteLeaveRequest();

  return {
    allLeaveRequests: query.data?.data || [],
    isLoadingAllLeaveRequests: query.isLoading,
    singleLeaveRequest: singleLrQuery.data?.data,
    isLoadingSingleLeaveRequest: singleLrQuery.isLoading,
    createLeaveRequest: createLr,
    updateLeaveRequest: updateLr,
    deleteLeaveRequest: deleteLr,
    isLoading: query.isLoading || singleLrQuery.isLoading,
  };
};
