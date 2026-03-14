import type { ApiResponse } from "./types";
import { getAccessToken } from "./auth";

const API_BASE_URL = process.env.API_BASE_URL || "http://114.29.238.125:7777/api/v1";

const getAuthHeaders = (): Record<string, string> => {
  const headers: Record<string, string> = {
    "Content-Type": "application/json",
  };
  const token = getAccessToken();
  if (token) {
    headers["Authorization"] = `Bearer ${token}`;
  }
  return headers;
};

const handleResponse = async (response: Response) => {
  if (!response.ok) {
    const error = await response
      .json()
      .catch(() => ({ message: response.statusText }));
    throw new Error(
      error.message || `Request failed with status ${response.status}`,
    );
  }
  return response.json();
};

// ==================== AUTH ====================
export const authApi = {
  login: async (credentials: {
    email?: string;
    username?: string;
    password: string;
  }) => {
    try {
      const response = await fetch(`${API_BASE_URL}/auth/login`, {
        method: "POST",
        headers: getAuthHeaders(),
        body: JSON.stringify(credentials),
      });

      if (!response.ok) {
        const error = await response.json();
        throw new Error(error.message || "Login failed");
      }

      return response.json();
    } catch (error) {
      if (error instanceof Error) {
        throw error;
      }
      throw new Error(
        "Cannot connect to server. Please check if the backend is running on http://localhost:7777",
      );
    }
  },
};

// ==================== USERS ====================
export const usersApi = {
  createUser: async (userData: {
    username: string;
    password: string;
    email: string;
    fullName: string;
    phoneNumber: string;
  }) => {
    const response = await fetch(`${API_BASE_URL}/users`, {
      method: "POST",
      headers: getAuthHeaders(),
      body: JSON.stringify(userData),
    });
    return handleResponse(response);
  },

  getAllUsers: async () => {
    const response = await fetch(`${API_BASE_URL}/users`, {
      method: "GET",
      headers: getAuthHeaders(),
    });
    return handleResponse(response);
  },

  getUserById: async (id: number) => {
    const response = await fetch(`${API_BASE_URL}/users/${id}`, {
      method: "GET",
      headers: getAuthHeaders(),
    });
    return handleResponse(response);
  },

  getUserByUsername: async (username: string) => {
    const response = await fetch(`${API_BASE_URL}/users/username/${username}`, {
      method: "GET",
      headers: getAuthHeaders(),
    });
    return handleResponse(response);
  },

  getUserByEmail: async (email: string) => {
    const response = await fetch(`${API_BASE_URL}/users/email/${email}`, {
      method: "GET",
      headers: getAuthHeaders(),
    });
    return handleResponse(response);
  },

  updateUser: async (
    id: number,
    userData: {
      username: string;
      email: string;
      fullName: string;
      phoneNumber: string;
      roleId?: number;
    },
  ) => {
    const response = await fetch(`${API_BASE_URL}/users/${id}`, {
      method: "PUT",
      headers: getAuthHeaders(),
      body: JSON.stringify(userData),
    });
    return handleResponse(response);
  },

  deleteUser: async (id: number) => {
    const response = await fetch(`${API_BASE_URL}/users/${id}`, {
      method: "DELETE",
      headers: getAuthHeaders(),
    });
    return handleResponse(response);
  },
};

// ==================== ROLES ====================
export const rolesApi = {
  createRole: async (roleData: { roleName: string; permissions: string }) => {
    const response = await fetch(`${API_BASE_URL}/roles`, {
      method: "POST",
      headers: getAuthHeaders(),
      body: JSON.stringify(roleData),
    });
    return handleResponse(response);
  },

  getAllRoles: async () => {
    const response = await fetch(`${API_BASE_URL}/roles`, {
      method: "GET",
      headers: getAuthHeaders(),
    });
    return handleResponse(response);
  },

  getRoleById: async (id: number) => {
    const response = await fetch(`${API_BASE_URL}/roles/${id}`, {
      method: "GET",
      headers: getAuthHeaders(),
    });
    return handleResponse(response);
  },

  getRoleByName: async (name: string) => {
    const response = await fetch(`${API_BASE_URL}/roles/name/${name}`, {
      method: "GET",
      headers: getAuthHeaders(),
    });
    return handleResponse(response);
  },

  updateRole: async (
    id: number,
    roleData: {
      roleName: string;
      permissions: string;
    },
  ) => {
    const response = await fetch(`${API_BASE_URL}/roles/${id}`, {
      method: "PUT",
      headers: getAuthHeaders(),
      body: JSON.stringify(roleData),
    });
    return handleResponse(response);
  },

  deleteRole: async (id: number) => {
    const response = await fetch(`${API_BASE_URL}/roles/${id}`, {
      method: "DELETE",
      headers: getAuthHeaders(),
    });
    return handleResponse(response);
  },
};

// ==================== DEPARTMENTS ====================
export const departmentsApi = {
  createDepartment: async (deptData: {
    name: string;
    description: string;
    headOfDepartmentId?: number | null;
  }) => {
    const response = await fetch(`${API_BASE_URL}/departments`, {
      method: "POST",
      headers: getAuthHeaders(),
      body: JSON.stringify(deptData),
    });
    return handleResponse(response);
  },

  getAllDepartments: async () => {
    const response = await fetch(`${API_BASE_URL}/departments`, {
      method: "GET",
      headers: getAuthHeaders(),
    });
    return handleResponse(response);
  },

  getDepartmentById: async (id: number) => {
    const response = await fetch(`${API_BASE_URL}/departments/${id}`, {
      method: "GET",
      headers: getAuthHeaders(),
    });
    return handleResponse(response);
  },

  getDepartmentByName: async (name: string) => {
    const response = await fetch(`${API_BASE_URL}/departments/name/${name}`, {
      method: "GET",
      headers: getAuthHeaders(),
    });
    return handleResponse(response);
  },

  updateDepartment: async (
    id: number,
    deptData: {
      name: string;
      description: string;
      headOfDepartmentId?: number | null;
    },
  ) => {
    const response = await fetch(`${API_BASE_URL}/departments/${id}`, {
      method: "PUT",
      headers: getAuthHeaders(),
      body: JSON.stringify(deptData),
    });
    return handleResponse(response);
  },

  deleteDepartment: async (id: number) => {
    const response = await fetch(`${API_BASE_URL}/departments/${id}`, {
      method: "DELETE",
      headers: getAuthHeaders(),
    });
    return handleResponse(response);
  },
};

// ==================== POSITIONS ====================
export const positionsApi = {
  createPosition: async (posData: {
    positionName: string;
    description: string;
    department: number;
    salary: number;
  }) => {
    const response = await fetch(`${API_BASE_URL}/positions`, {
      method: "POST",
      headers: getAuthHeaders(),
      body: JSON.stringify(posData),
    });
    return handleResponse(response);
  },

  getAllPositions: async () => {
    const response = await fetch(`${API_BASE_URL}/positions`, {
      method: "GET",
      headers: getAuthHeaders(),
    });
    return handleResponse(response);
  },

  getPositionById: async (id: number) => {
    const response = await fetch(`${API_BASE_URL}/positions/${id}`, {
      method: "GET",
      headers: getAuthHeaders(),
    });
    return handleResponse(response);
  },

  getPositionsByDepartment: async (departmentId: number) => {
    const response = await fetch(
      `${API_BASE_URL}/positions/department/${departmentId}`,
      {
        method: "GET",
        headers: getAuthHeaders(),
      },
    );
    return handleResponse(response);
  },

  updatePosition: async (
    id: number,
    posData: {
      positionName: string;
      description: string;
      department: number;
      salary: number;
    },
  ) => {
    const response = await fetch(`${API_BASE_URL}/positions/${id}`, {
      method: "PUT",
      headers: getAuthHeaders(),
      body: JSON.stringify(posData),
    });
    return handleResponse(response);
  },

  deletePosition: async (id: number) => {
    const response = await fetch(`${API_BASE_URL}/positions/${id}`, {
      method: "DELETE",
      headers: getAuthHeaders(),
    });
    return handleResponse(response);
  },
};

// ==================== EMPLOYEES ====================
export const employeesApi = {
  createEmployee: async (formData: FormData) => {
    const token = getAccessToken();
    const response = await fetch(`${API_BASE_URL}/employees`, {
      method: "POST",
      headers: token ? { Authorization: `Bearer ${token}` } : {},
      body: formData,
    });
    return handleResponse(response);
  },

  getAllEmployees: async () => {
    const response = await fetch(`${API_BASE_URL}/employees`, {
      method: "GET",
      headers: getAuthHeaders(),
    });
    return handleResponse(response);
  },

  getEmployeeById: async (id: number) => {
    const response = await fetch(`${API_BASE_URL}/employees/${id}`, {
      method: "GET",
      headers: getAuthHeaders(),
    });
    return handleResponse(response);
  },

  getEmployeesByDepartment: async (departmentId: number) => {
    const response = await fetch(
      `${API_BASE_URL}/employees/department/${departmentId}`,
      {
        method: "GET",
        headers: getAuthHeaders(),
      },
    );
    return handleResponse(response);
  },

  getEmployeesByStatus: async (status: string) => {
    const response = await fetch(`${API_BASE_URL}/employees/status/${status}`, {
      method: "GET",
      headers: getAuthHeaders(),
    });
    return handleResponse(response);
  },

  updateEmployee: async (
    id: number,
    empData: {
      fullName: string;
      email: string;
      phoneNumber?: string;
      departmentId: number;
      positionId: number;
      employmentType: string;
      salary: number;
      hireDate: string;
      status: boolean;
      dateOfBirth?: string;
      nationality?: string;
      address?: string;
      imageUrl?: string;
    },
  ) => {
    const response = await fetch(`${API_BASE_URL}/employees/${id}`, {
      method: "PUT",
      headers: getAuthHeaders(),
      body: JSON.stringify(empData),
    });
    return handleResponse(response);
  },

  uploadEmployeeImage: async (id: number, file: File) => {
    const formData = new FormData();
    formData.append("image", file);
    const token = getAccessToken();
    const response = await fetch(
      `${API_BASE_URL}/employees/${id}/upload-image`,
      {
        method: "POST",
        headers: token ? { Authorization: `Bearer ${token}` } : {},
        body: formData,
      },
    );
    return handleResponse(response);
  },

  deleteEmployee: async (id: number) => {
    const response = await fetch(`${API_BASE_URL}/employees/${id}`, {
      method: "DELETE",
      headers: getAuthHeaders(),
    });
    return handleResponse(response);
  },
};

// ==================== ATTENDANCE ====================
export const attendanceApi = {
  createAttendance: async (attData: {
    employeeId: number;
    checkIn: string;
    checkOut: string;
    status: string;
  }) => {
    const response = await fetch(`${API_BASE_URL}/attendance`, {
      method: "POST",
      headers: getAuthHeaders(),
      body: JSON.stringify(attData),
    });
    return handleResponse(response);
  },

  getAllAttendance: async () => {
    const response = await fetch(`${API_BASE_URL}/attendance`, {
      method: "GET",
      headers: getAuthHeaders(),
    });
    return handleResponse(response);
  },

  getAttendanceById: async (id: number) => {
    const response = await fetch(`${API_BASE_URL}/attendance/${id}`, {
      method: "GET",
      headers: getAuthHeaders(),
    });
    return handleResponse(response);
  },

  getAttendanceByEmployee: async (employeeId: number) => {
    const response = await fetch(
      `${API_BASE_URL}/attendance/employee/${employeeId}`,
      {
        method: "GET",
        headers: getAuthHeaders(),
      },
    );
    return handleResponse(response);
  },

  updateAttendance: async (
    id: number,
    attData: {
      employeeId: number;
      checkIn: string;
      checkOut: string;
      status: string;
    },
  ) => {
    const response = await fetch(`${API_BASE_URL}/attendance/${id}`, {
      method: "PUT",
      headers: getAuthHeaders(),
      body: JSON.stringify(attData),
    });
    return handleResponse(response);
  },

  deleteAttendance: async (id: number) => {
    const response = await fetch(`${API_BASE_URL}/attendance/${id}`, {
      method: "DELETE",
      headers: getAuthHeaders(),
    });
    return handleResponse(response);
  },
};

// ==================== LEAVE TYPES ====================
export const leaveTypesApi = {
  createLeaveType: async (ltData: {
    name: string;
    description: string;
    daysAllowed: number;
  }) => {
    const response = await fetch(`${API_BASE_URL}/leave-types`, {
      method: "POST",
      headers: getAuthHeaders(),
      body: JSON.stringify(ltData),
    });
    return handleResponse(response);
  },

  getAllLeaveTypes: async () => {
    const response = await fetch(`${API_BASE_URL}/leave-types`, {
      method: "GET",
      headers: getAuthHeaders(),
    });
    return handleResponse(response);
  },

  getLeaveTypeById: async (id: number) => {
    const response = await fetch(`${API_BASE_URL}/leave-types/${id}`, {
      method: "GET",
      headers: getAuthHeaders(),
    });
    return handleResponse(response);
  },

  getLeaveTypeByName: async (name: string) => {
    const response = await fetch(`${API_BASE_URL}/leave-types/name/${name}`, {
      method: "GET",
      headers: getAuthHeaders(),
    });
    return handleResponse(response);
  },

  updateLeaveType: async (
    id: number,
    ltData: {
      name: string;
      description: string;
      daysAllowed: number;
    },
  ) => {
    const response = await fetch(`${API_BASE_URL}/leave-types/${id}`, {
      method: "PUT",
      headers: getAuthHeaders(),
      body: JSON.stringify(ltData),
    });
    return handleResponse(response);
  },

  deleteLeaveType: async (id: number) => {
    const response = await fetch(`${API_BASE_URL}/leave-types/${id}`, {
      method: "DELETE",
      headers: getAuthHeaders(),
    });
    return handleResponse(response);
  },
};

// ==================== LEAVE REQUESTS ====================
export const leaveRequestsApi = {
  createLeaveRequest: async (lrData: {
    employeeId: number;
    leaveTypeId: number;
    startDate: string;
    endDate: string;
    reason: string;
    status: string;
  }) => {
    const response = await fetch(`${API_BASE_URL}/leave-requests`, {
      method: "POST",
      headers: getAuthHeaders(),
      body: JSON.stringify(lrData),
    });
    return handleResponse(response);
  },

  getAllLeaveRequests: async () => {
    const response = await fetch(`${API_BASE_URL}/leave-requests`, {
      method: "GET",
      headers: getAuthHeaders(),
    });
    return handleResponse(response);
  },

  getLeaveRequestById: async (id: number) => {
    const response = await fetch(`${API_BASE_URL}/leave-requests/${id}`, {
      method: "GET",
      headers: getAuthHeaders(),
    });
    return handleResponse(response);
  },

  getLeaveRequestsByEmployee: async (employeeId: number) => {
    const response = await fetch(
      `${API_BASE_URL}/leave-requests/employee/${employeeId}`,
      {
        method: "GET",
        headers: getAuthHeaders(),
      },
    );
    return handleResponse(response);
  },

  getLeaveRequestsByStatus: async (status: string) => {
    const response = await fetch(
      `${API_BASE_URL}/leave-requests/status/${status}`,
      {
        method: "GET",
        headers: getAuthHeaders(),
      },
    );
    return handleResponse(response);
  },

  updateLeaveRequest: async (
    id: number,
    lrData: {
      employeeId: number;
      leaveTypeId: number;
      startDate: string;
      endDate: string;
      reason: string;
      status: string;
    },
  ) => {
    const response = await fetch(`${API_BASE_URL}/leave-requests/${id}`, {
      method: "PUT",
      headers: getAuthHeaders(),
      body: JSON.stringify(lrData),
    });
    return handleResponse(response);
  },

  deleteLeaveRequest: async (id: number) => {
    const response = await fetch(`${API_BASE_URL}/leave-requests/${id}`, {
      method: "DELETE",
      headers: getAuthHeaders(),
    });
    return handleResponse(response);
  },
};

// ==================== BENEFITS ====================
export const benefitsApi = {
  createBenefit: async (benData: {
    name: string;
    description: string;
    amount: number;
  }) => {
    const response = await fetch(`${API_BASE_URL}/benefits`, {
      method: "POST",
      headers: getAuthHeaders(),
      body: JSON.stringify(benData),
    });
    return handleResponse(response);
  },

  getAllBenefits: async () => {
    const response = await fetch(`${API_BASE_URL}/benefits`, {
      method: "GET",
      headers: getAuthHeaders(),
    });
    return handleResponse(response);
  },

  getBenefitById: async (id: number) => {
    const response = await fetch(`${API_BASE_URL}/benefits/${id}`, {
      method: "GET",
      headers: getAuthHeaders(),
    });
    return handleResponse(response);
  },

  getBenefitByName: async (name: string) => {
    const response = await fetch(`${API_BASE_URL}/benefits/name/${name}`, {
      method: "GET",
      headers: getAuthHeaders(),
    });
    return handleResponse(response);
  },

  updateBenefit: async (
    id: number,
    benData: {
      name: string;
      description: string;
      amount: number;
    },
  ) => {
    const response = await fetch(`${API_BASE_URL}/benefits/${id}`, {
      method: "PUT",
      headers: getAuthHeaders(),
      body: JSON.stringify(benData),
    });
    return handleResponse(response);
  },

  deleteBenefit: async (id: number) => {
    const response = await fetch(`${API_BASE_URL}/benefits/${id}`, {
      method: "DELETE",
      headers: getAuthHeaders(),
    });
    return handleResponse(response);
  },
};

// ==================== EMPLOYEE BENEFITS ====================
export const employeeBenefitsApi = {
  createEmployeeBenefit: async (ebData: {
    employeeId: number;
    benefitId: number;
    amount: number;
  }) => {
    const response = await fetch(`${API_BASE_URL}/employee-benefits`, {
      method: "POST",
      headers: getAuthHeaders(),
      body: JSON.stringify(ebData),
    });
    return handleResponse(response);
  },

  getAllEmployeeBenefits: async () => {
    const response = await fetch(`${API_BASE_URL}/employee-benefits`, {
      method: "GET",
      headers: getAuthHeaders(),
    });
    return handleResponse(response);
  },

  getEmployeeBenefitById: async (id: number) => {
    const response = await fetch(`${API_BASE_URL}/employee-benefits/${id}`, {
      method: "GET",
      headers: getAuthHeaders(),
    });
    return handleResponse(response);
  },

  getEmployeeBenefitsByEmployee: async (employeeId: number) => {
    const response = await fetch(
      `${API_BASE_URL}/employee-benefits/employee/${employeeId}`,
      {
        method: "GET",
        headers: getAuthHeaders(),
      },
    );
    return handleResponse(response);
  },

  updateEmployeeBenefit: async (
    id: number,
    ebData: {
      employeeId: number;
      benefitId: number;
      amount: number;
    },
  ) => {
    const response = await fetch(`${API_BASE_URL}/employee-benefits/${id}`, {
      method: "PUT",
      headers: getAuthHeaders(),
      body: JSON.stringify(ebData),
    });
    return handleResponse(response);
  },

  deleteEmployeeBenefit: async (id: number) => {
    const response = await fetch(`${API_BASE_URL}/employee-benefits/${id}`, {
      method: "DELETE",
      headers: getAuthHeaders(),
    });
    return handleResponse(response);
  },
};

// ==================== PAYROLL ====================
export const payrollApi = {
  createPayroll: async (prData: {
    employeeId: number;
    month: number;
    year: number;
    basicSalary: number;
    bonus: number;
    deductions: number;
    netSalary: number;
  }) => {
    const response = await fetch(`${API_BASE_URL}/payroll`, {
      method: "POST",
      headers: getAuthHeaders(),
      body: JSON.stringify(prData),
    });
    return handleResponse(response);
  },

  getAllPayroll: async () => {
    const response = await fetch(`${API_BASE_URL}/payroll`, {
      method: "GET",
      headers: getAuthHeaders(),
    });
    return handleResponse(response);
  },

  getPayrollById: async (id: number) => {
    const response = await fetch(`${API_BASE_URL}/payroll/${id}`, {
      method: "GET",
      headers: getAuthHeaders(),
    });
    return handleResponse(response);
  },

  getPayrollByEmployee: async (employeeId: number) => {
    const response = await fetch(
      `${API_BASE_URL}/payroll/employee/${employeeId}`,
      {
        method: "GET",
        headers: getAuthHeaders(),
      },
    );
    return handleResponse(response);
  },

  updatePayroll: async (
    id: number,
    prData: {
      employeeId: number;
      month: number;
      year: number;
      basicSalary: number;
      bonus: number;
      deductions: number;
      netSalary: number;
    },
  ) => {
    const response = await fetch(`${API_BASE_URL}/payroll/${id}`, {
      method: "PUT",
      headers: getAuthHeaders(),
      body: JSON.stringify(prData),
    });
    return handleResponse(response);
  },

  deletePayroll: async (id: number) => {
    const response = await fetch(`${API_BASE_URL}/payroll/${id}`, {
      method: "DELETE",
      headers: getAuthHeaders(),
    });
    return handleResponse(response);
  },
};

// ==================== AUDIT LOGS ====================
export const auditLogsApi = {
  createAuditLog: async (alData: {
    userId: number;
    action: string;
    tableName: string;
    recordId: number;
    changes: string;
  }) => {
    const response = await fetch(`${API_BASE_URL}/audit-logs`, {
      method: "POST",
      headers: getAuthHeaders(),
      body: JSON.stringify(alData),
    });
    return handleResponse(response);
  },

  getAllAuditLogs: async () => {
    const response = await fetch(`${API_BASE_URL}/audit-logs`, {
      method: "GET",
      headers: getAuthHeaders(),
    });
    return handleResponse(response);
  },

  getAuditLogById: async (id: number) => {
    const response = await fetch(`${API_BASE_URL}/audit-logs/${id}`, {
      method: "GET",
      headers: getAuthHeaders(),
    });
    return handleResponse(response);
  },

  getAuditLogsByUser: async (userId: number) => {
    const response = await fetch(`${API_BASE_URL}/audit-logs/user/${userId}`, {
      method: "GET",
      headers: getAuthHeaders(),
    });
    return handleResponse(response);
  },

  getAuditLogsByTable: async (tableName: string) => {
    const response = await fetch(
      `${API_BASE_URL}/audit-logs/table/${tableName}`,
      {
        method: "GET",
        headers: getAuthHeaders(),
      },
    );
    return handleResponse(response);
  },

  getAuditLogsByAction: async (action: string) => {
    const response = await fetch(
      `${API_BASE_URL}/audit-logs/action/${action}`,
      {
        method: "GET",
        headers: getAuthHeaders(),
      },
    );
    return handleResponse(response);
  },
};

// ==================== ANNOUNCEMENTS ====================
export const announcementsApi = {
  createAnnouncement: async (data: {
    title: string;
    content: string;
    priority: string;
    publishedAt?: string;
    expiresAt?: string;
    createdById?: number;
  }) => {
    const response = await fetch(`${API_BASE_URL}/announcements`, {
      method: "POST",
      headers: getAuthHeaders(),
      body: JSON.stringify(data),
    });
    return handleResponse(response);
  },

  getAllAnnouncements: async () => {
    const response = await fetch(`${API_BASE_URL}/announcements`, {
      method: "GET",
      headers: getAuthHeaders(),
    });
    return handleResponse(response);
  },

  getAnnouncementById: async (id: number) => {
    const response = await fetch(`${API_BASE_URL}/announcements/${id}`, {
      method: "GET",
      headers: getAuthHeaders(),
    });
    return handleResponse(response);
  },

  updateAnnouncement: async (
    id: number,
    data: {
      title: string;
      content: string;
      priority: string;
      publishedAt?: string;
      expiresAt?: string;
    },
  ) => {
    const response = await fetch(`${API_BASE_URL}/announcements/${id}`, {
      method: "PUT",
      headers: getAuthHeaders(),
      body: JSON.stringify(data),
    });
    return handleResponse(response);
  },

  deleteAnnouncement: async (id: number) => {
    const response = await fetch(`${API_BASE_URL}/announcements/${id}`, {
      method: "DELETE",
      headers: getAuthHeaders(),
    });
    return handleResponse(response);
  },
};

// ==================== JOB POSTINGS ====================
export const jobPostingsApi = {
  createJobPosting: async (jobData: any) => {
    const response = await fetch(`${API_BASE_URL}/job-postings`, {
      method: "POST",
      headers: getAuthHeaders(),
      body: JSON.stringify(jobData),
    });
    return handleResponse(response);
  },

  getAllJobPostings: async () => {
    const response = await fetch(`${API_BASE_URL}/job-postings`, {
      method: "GET",
      headers: getAuthHeaders(),
    });
    return handleResponse(response);
  },

  getJobPostingById: async (id: string | number) => {
    const response = await fetch(`${API_BASE_URL}/job-postings/${id}`, {
      method: "GET",
      headers: getAuthHeaders(),
    });
    return handleResponse(response);
  },
};

// ==================== CLOUDINARY ====================
export const cloudinaryApi = {
  uploadImage: async (file: File) => {
    const formData = new FormData();
    formData.append("image", file);
    const token = getAccessToken();
    const response = await fetch(`${API_BASE_URL}/cloud/upload`, {
      method: "POST",
      headers: token ? { Authorization: `Bearer ${token}` } : {},
      body: formData,
    });
    return handleResponse(response);
  },

  verifyCloudinaryConfig: async () => {
    const response = await fetch(`${API_BASE_URL}/cloud/verify`, {
      method: "GET",
      headers: getAuthHeaders(),
    });
    return handleResponse(response);
  },
};
