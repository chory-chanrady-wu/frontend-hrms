import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { usersApi } from "@/lib/api";

// Query Keys
const USER_KEYS = {
  all: ["users"] as const,
  lists: () => [...USER_KEYS.all, "list"] as const,
  list: (filters: string) => [...USER_KEYS.lists(), { filters }] as const,
  details: () => [...USER_KEYS.all, "detail"] as const,
  detail: (id: number) => [...USER_KEYS.details(), id] as const,
  byUsername: (username: string) =>
    [...USER_KEYS.all, "username", username] as const,
  byEmail: (email: string) => [...USER_KEYS.all, "email", email] as const,
};

// ==================== QUERIES ====================

/**
 * Hook to fetch all users
 */
export const useGetAllUsers = () => {
  return useQuery({
    queryKey: USER_KEYS.lists(),
    queryFn: () => usersApi.getAllUsers(),
    staleTime: 5 * 60 * 1000, // 5 minutes
  });
};

/**
 * Hook to fetch user by ID
 */
export const useGetUserById = (id: number) => {
  return useQuery({
    queryKey: USER_KEYS.detail(id),
    queryFn: () => usersApi.getUserById(id),
    staleTime: 5 * 60 * 1000,
    enabled: !!id, // Only run query if id exists
  });
};

/**
 * Hook to fetch user by username
 */
export const useGetUserByUsername = (username: string) => {
  return useQuery({
    queryKey: USER_KEYS.byUsername(username),
    queryFn: () => usersApi.getUserByUsername(username),
    staleTime: 5 * 60 * 1000,
    enabled: !!username,
  });
};

/**
 * Hook to fetch user by email
 */
export const useGetUserByEmail = (email: string) => {
  return useQuery({
    queryKey: USER_KEYS.byEmail(email),
    queryFn: () => usersApi.getUserByEmail(email),
    staleTime: 5 * 60 * 1000,
    enabled: !!email,
  });
};

// ==================== MUTATIONS ====================

/**
 * Hook to create a new user
 */
export const useCreateUser = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (userData: {
      username: string;
      password: string;
      email: string;
      fullName: string;
      phone: string;
    }) => usersApi.createUser(userData),
    onSuccess: () => {
      // Invalidate users list to refetch
      queryClient.invalidateQueries({ queryKey: USER_KEYS.lists() });
    },
    onError: (error: Error) => {
      console.error("Error creating user:", error);
    },
  });
};

/**
 * Hook to update a user
 */
export const useUpdateUser = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({
      id,
      userData,
    }: {
      id: number;
      userData: {
        username: string;
        email: string;
        fullName: string;
        phone: string;
      };
    }) => usersApi.updateUser(id, userData),
    onSuccess: (data, { id }) => {
      // Invalidate specific user and list
      queryClient.invalidateQueries({ queryKey: USER_KEYS.detail(id) });
      queryClient.invalidateQueries({ queryKey: USER_KEYS.lists() });
    },
    onError: (error: Error) => {
      console.error("Error updating user:", error);
    },
  });
};

/**
 * Hook to delete a user
 */
export const useDeleteUser = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (id: number) => usersApi.deleteUser(id),
    onSuccess: (data, id) => {
      // Invalidate specific user and list
      queryClient.invalidateQueries({ queryKey: USER_KEYS.detail(id) });
      queryClient.invalidateQueries({ queryKey: USER_KEYS.lists() });
    },
    onError: (error: Error) => {
      console.error("Error deleting user:", error);
    },
  });
};

// ==================== HELPER HOOKS ====================

/**
 * Combined hook for user management (fetch + mutations)
 */
export const useUserManagement = (userId?: number) => {
  const query = useGetAllUsers();
  const singleUserQuery = useGetUserById(userId || 0);
  const createUser = useCreateUser();
  const updateUser = useUpdateUser();
  const deleteUser = useDeleteUser();

  return {
    // Queries
    allUsers: query.data?.data || [],
    isLoadingAllUsers: query.isLoading,
    errorAllUsers: query.error,
    singleUser: singleUserQuery.data?.data,
    isLoadingSingleUser: singleUserQuery.isLoading,
    errorSingleUser: singleUserQuery.error,
    // Mutations
    createUser,
    updateUser,
    deleteUser,
    isLoading:
      query.isLoading ||
      singleUserQuery.isLoading ||
      createUser.isPending ||
      updateUser.isPending ||
      deleteUser.isPending,
  };
};
