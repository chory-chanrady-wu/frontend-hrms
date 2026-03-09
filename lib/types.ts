/**
 * Centralized type definitions for the HR Management System
 */

/** API Response wrapper for all endpoints */
export interface ApiResponse<T> {
  success: boolean;
  message: string;
  data?: T;
}

/** Employee profile information */
export type EmployeeProfile = {
  id: number;
  userId: number;
  username: string;
  fullName: string;
  email: string;
  phoneNumber: string | null;
  userStatus: string;
  departmentId: number;
  departmentName: string;
  positionId: number;
  positionName: string;
  employmentType: string;
  salary: number;
  hireDate: string;
  dateOfBirth: string | null;
  nationality: string | null;
  address: string | null;
  status: boolean;
  imageUrl: string;
  createdAt: string;
  updatedAt: string;
};

/** Sidebar context state and methods */
export type SidebarContextProps = {
  state: "expanded" | "collapsed";
  open: boolean;
  setOpen: (open: boolean) => void;
  openMobile: boolean;
  setOpenMobile: (open: boolean) => void;
  isMobile: boolean;
  toggleSidebar: () => void;
};

/** Dashboard layout component props */
export type DashboardLayoutProps = {
  children: React.ReactNode;
};

/** Role information from API */
export type RoleInfo = {
  id: number;
  roleName: string;
  permissions: string;
  createdAt: string;
  updatedAt: string;
};

/** User information from API */
export type UserInfo = {
  id: number;
  username: string;
  fullName: string;
  email: string;
  phoneNumber: string | null;
  passwordHash: string;
  roleId: number;
  roleName: string;
  imageUrl: string | null;
  status: boolean;
  createdAt: string;
  updatedAt: string;
};
