import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { attendanceApi } from "@/lib/api";

const ATT_KEYS = {
  all: ["attendance"] as const,
  lists: () => [...ATT_KEYS.all, "list"] as const,
  list: (filters: string) => [...ATT_KEYS.lists(), { filters }] as const,
  details: () => [...ATT_KEYS.all, "detail"] as const,
  detail: (id: number) => [...ATT_KEYS.details(), id] as const,
  byEmployee: (empId: number) => [...ATT_KEYS.all, "employee", empId] as const,
};

export const useGetAllAttendance = () => {
  return useQuery({
    queryKey: ATT_KEYS.lists(),
    queryFn: () => attendanceApi.getAllAttendance(),
    staleTime: 5 * 60 * 1000,
  });
};

export const useGetAttendanceById = (id: number) => {
  return useQuery({
    queryKey: ATT_KEYS.detail(id),
    queryFn: () => attendanceApi.getAttendanceById(id),
    staleTime: 5 * 60 * 1000,
    enabled: !!id,
  });
};

export const useGetAttendanceByEmployee = (employeeId: number) => {
  return useQuery({
    queryKey: ATT_KEYS.byEmployee(employeeId),
    queryFn: () => attendanceApi.getAttendanceByEmployee(employeeId),
    staleTime: 5 * 60 * 1000,
    enabled: !!employeeId,
  });
};

export const useCreateAttendance = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (attData: {
      employeeId: number;
      checkIn: string;
      checkOut: string;
      status: string;
    }) => attendanceApi.createAttendance(attData),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ATT_KEYS.lists() });
    },
  });
};

export const useUpdateAttendance = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: ({
      id,
      attData,
    }: {
      id: number;
      attData: {
        employeeId: number;
        checkIn: string;
        checkOut: string;
        status: string;
      };
    }) => attendanceApi.updateAttendance(id, attData),
    onSuccess: (_data: any, { id }: any) => {
      queryClient.invalidateQueries({ queryKey: ATT_KEYS.detail(id) });
      queryClient.invalidateQueries({ queryKey: ATT_KEYS.lists() });
    },
  });
};

export const useDeleteAttendance = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (id: number) => attendanceApi.deleteAttendance(id),
    onSuccess: (_data: any, id: any) => {
      queryClient.invalidateQueries({ queryKey: ATT_KEYS.detail(id) });
      queryClient.invalidateQueries({ queryKey: ATT_KEYS.lists() });
    },
  });
};

export const useAttendanceManagement = (attId?: number) => {
  const query = useGetAllAttendance();
  const singleAttQuery = useGetAttendanceById(attId || 0);
  const createAtt = useCreateAttendance();
  const updateAtt = useUpdateAttendance();
  const deleteAtt = useDeleteAttendance();

  return {
    allAttendance: query.data?.data || [],
    isLoadingAllAttendance: query.isLoading,
    singleAttendance: singleAttQuery.data?.data,
    isLoadingSingleAttendance: singleAttQuery.isLoading,
    createAttendance: createAtt,
    updateAttendance: updateAtt,
    deleteAttendance: deleteAtt,
    isLoading: query.isLoading || singleAttQuery.isLoading,
  };
};
