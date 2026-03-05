const API_BASE_URL = "http://localhost:7777/api/v1";

interface ApiResponse<T> {
  success: boolean;
  message: string;
  data?: T;
}

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
        headers: { "Content-Type": "application/json" },
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
    phone: string;
  }) => {
    const response = await fetch(`${API_BASE_URL}/users`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(userData),
    });
    return response.json();
  },

  getAllUsers: async () => {
    const response = await fetch(`${API_BASE_URL}/users`, {
      method: "GET",
      headers: { "Content-Type": "application/json" },
    });
    return response.json();
  },

  getUserById: async (id: number) => {
    const response = await fetch(`${API_BASE_URL}/users/${id}`, {
      method: "GET",
      headers: { "Content-Type": "application/json" },
    });
    return response.json();
  },

  getUserByUsername: async (username: string) => {
    const response = await fetch(`${API_BASE_URL}/users/username/${username}`, {
      method: "GET",
      headers: { "Content-Type": "application/json" },
    });
    return response.json();
  },

  getUserByEmail: async (email: string) => {
    const response = await fetch(`${API_BASE_URL}/users/email/${email}`, {
      method: "GET",
      headers: { "Content-Type": "application/json" },
    });
    return response.json();
  },

  updateUser: async (
    id: number,
    userData: {
      username: string;
      email: string;
      fullName: string;
      phone: string;
    },
  ) => {
    const response = await fetch(`${API_BASE_URL}/users/${id}`, {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(userData),
    });
    return response.json();
  },

  deleteUser: async (id: number) => {
    const response = await fetch(`${API_BASE_URL}/users/${id}`, {
      method: "DELETE",
      headers: { "Content-Type": "application/json" },
    });
    return response.json();
  },
};

// ==================== ROLES ====================
export const rolesApi = {
  createRole: async (roleData: { roleName: string; permissions: string }) => {
    const response = await fetch(`${API_BASE_URL}/roles`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(roleData),
    });
    return response.json();
  },

  getAllRoles: async () => {
    const response = await fetch(`${API_BASE_URL}/roles`, {
      method: "GET",
      headers: { "Content-Type": "application/json" },
    });
    return response.json();
  },

  getRoleById: async (id: number) => {
    const response = await fetch(`${API_BASE_URL}/roles/${id}`, {
      method: "GET",
      headers: { "Content-Type": "application/json" },
    });
    return response.json();
  },

  getRoleByName: async (name: string) => {
    const response = await fetch(`${API_BASE_URL}/roles/name/${name}`, {
      method: "GET",
      headers: { "Content-Type": "application/json" },
    });
    return response.json();
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
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(roleData),
    });
    return response.json();
  },

  deleteRole: async (id: number) => {
    const response = await fetch(`${API_BASE_URL}/roles/${id}`, {
      method: "DELETE",
      headers: { "Content-Type": "application/json" },
    });
    return response.json();
  },
};

// ==================== DEPARTMENTS ====================
export const departmentsApi = {
  createDepartment: async (deptData: { name: string; description: string }) => {
    const response = await fetch(`${API_BASE_URL}/departments`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(deptData),
    });
    return response.json();
  },

  getAllDepartments: async () => {
    const response = await fetch(`${API_BASE_URL}/departments`, {
      method: "GET",
      headers: { "Content-Type": "application/json" },
    });
    return response.json();
  },

  getDepartmentById: async (id: number) => {
    const response = await fetch(`${API_BASE_URL}/departments/${id}`, {
      method: "GET",
      headers: { "Content-Type": "application/json" },
    });
    return response.json();
  },

  getDepartmentByName: async (name: string) => {
    const response = await fetch(`${API_BASE_URL}/departments/name/${name}`, {
      method: "GET",
      headers: { "Content-Type": "application/json" },
    });
    return response.json();
  },

  updateDepartment: async (
    id: number,
    deptData: {
      name: string;
      description: string;
    },
  ) => {
    const response = await fetch(`${API_BASE_URL}/departments/${id}`, {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(deptData),
    });
    return response.json();
  },

  deleteDepartment: async (id: number) => {
    const response = await fetch(`${API_BASE_URL}/departments/${id}`, {
      method: "DELETE",
      headers: { "Content-Type": "application/json" },
    });
    return response.json();
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
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(posData),
    });
    return response.json();
  },

  getAllPositions: async () => {
    const response = await fetch(`${API_BASE_URL}/positions`, {
      method: "GET",
      headers: { "Content-Type": "application/json" },
    });
    return response.json();
  },

  getPositionById: async (id: number) => {
    const response = await fetch(`${API_BASE_URL}/positions/${id}`, {
      method: "GET",
      headers: { "Content-Type": "application/json" },
    });
    return response.json();
  },

  getPositionsByDepartment: async (departmentId: number) => {
    const response = await fetch(
      `${API_BASE_URL}/positions/department/${departmentId}`,
      {
        method: "GET",
        headers: { "Content-Type": "application/json" },
      },
    );
    return response.json();
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
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(posData),
    });
    return response.json();
  },

  deletePosition: async (id: number) => {
    const response = await fetch(`${API_BASE_URL}/positions/${id}`, {
      method: "DELETE",
      headers: { "Content-Type": "application/json" },
    });
    return response.json();
  },
};

// ==================== EMPLOYEES ====================
export const employeesApi = {
  createEmployee: async (empData: {
    userId: number;
    departmentId: number;
    jobTitle: string;
    employmentType: string;
    salary: number;
    hireDate: string;
    status: string;
  }) => {
    const response = await fetch(`${API_BASE_URL}/employees`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(empData),
    });
    return response.json();
  },

  getAllEmployees: async () => {
    const response = await fetch(`${API_BASE_URL}/employees`, {
      method: "GET",
      headers: { "Content-Type": "application/json" },
    });
    return response.json();
  },

  getEmployeeById: async (id: number) => {
    const response = await fetch(`${API_BASE_URL}/employees/${id}`, {
      method: "GET",
      headers: { "Content-Type": "application/json" },
    });
    return response.json();
  },

  getEmployeesByDepartment: async (departmentId: number) => {
    const response = await fetch(
      `${API_BASE_URL}/employees/department/${departmentId}`,
      {
        method: "GET",
        headers: { "Content-Type": "application/json" },
      },
    );
    return response.json();
  },

  getEmployeesByStatus: async (status: string) => {
    const response = await fetch(`${API_BASE_URL}/employees/status/${status}`, {
      method: "GET",
      headers: { "Content-Type": "application/json" },
    });
    return response.json();
  },

  updateEmployee: async (
    id: number,
    empData: {
      userId: number;
      departmentId: number;
      jobTitle: string;
      employmentType: string;
      salary: number;
      hireDate: string;
      status: string;
    },
  ) => {
    const response = await fetch(`${API_BASE_URL}/employees/${id}`, {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(empData),
    });
    return response.json();
  },

  uploadEmployeeImage: async (id: number, file: File) => {
    const formData = new FormData();
    formData.append("image", file);
    const response = await fetch(
      `${API_BASE_URL}/employees/${id}/upload-image`,
      {
        method: "POST",
        body: formData,
      },
    );
    return response.json();
  },

  deleteEmployee: async (id: number) => {
    const response = await fetch(`${API_BASE_URL}/employees/${id}`, {
      method: "DELETE",
      headers: { "Content-Type": "application/json" },
    });
    return response.json();
  },
};

// ==================== ATTENDANCE ====================
export const attendanceApi = {
  createAttendance: async (attData: {
    employeeId: number;
    date: string;
    status: string;
    checkInTime: string;
    checkOutTime: string;
  }) => {
    const response = await fetch(`${API_BASE_URL}/attendance`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(attData),
    });
    return response.json();
  },

  getAllAttendance: async () => {
    const response = await fetch(`${API_BASE_URL}/attendance`, {
      method: "GET",
      headers: { "Content-Type": "application/json" },
    });
    return response.json();
  },

  getAttendanceById: async (id: number) => {
    const response = await fetch(`${API_BASE_URL}/attendance/${id}`, {
      method: "GET",
      headers: { "Content-Type": "application/json" },
    });
    return response.json();
  },

  getAttendanceByEmployee: async (employeeId: number) => {
    const response = await fetch(
      `${API_BASE_URL}/attendance/employee/${employeeId}`,
      {
        method: "GET",
        headers: { "Content-Type": "application/json" },
      },
    );
    return response.json();
  },

  updateAttendance: async (
    id: number,
    attData: {
      employeeId: number;
      date: string;
      status: string;
      checkInTime: string;
      checkOutTime: string;
    },
  ) => {
    const response = await fetch(`${API_BASE_URL}/attendance/${id}`, {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(attData),
    });
    return response.json();
  },

  deleteAttendance: async (id: number) => {
    const response = await fetch(`${API_BASE_URL}/attendance/${id}`, {
      method: "DELETE",
      headers: { "Content-Type": "application/json" },
    });
    return response.json();
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
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(ltData),
    });
    return response.json();
  },

  getAllLeaveTypes: async () => {
    const response = await fetch(`${API_BASE_URL}/leave-types`, {
      method: "GET",
      headers: { "Content-Type": "application/json" },
    });
    return response.json();
  },

  getLeaveTypeById: async (id: number) => {
    const response = await fetch(`${API_BASE_URL}/leave-types/${id}`, {
      method: "GET",
      headers: { "Content-Type": "application/json" },
    });
    return response.json();
  },

  getLeaveTypeByName: async (name: string) => {
    const response = await fetch(`${API_BASE_URL}/leave-types/name/${name}`, {
      method: "GET",
      headers: { "Content-Type": "application/json" },
    });
    return response.json();
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
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(ltData),
    });
    return response.json();
  },

  deleteLeaveType: async (id: number) => {
    const response = await fetch(`${API_BASE_URL}/leave-types/${id}`, {
      method: "DELETE",
      headers: { "Content-Type": "application/json" },
    });
    return response.json();
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
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(lrData),
    });
    return response.json();
  },

  getAllLeaveRequests: async () => {
    const response = await fetch(`${API_BASE_URL}/leave-requests`, {
      method: "GET",
      headers: { "Content-Type": "application/json" },
    });
    return response.json();
  },

  getLeaveRequestById: async (id: number) => {
    const response = await fetch(`${API_BASE_URL}/leave-requests/${id}`, {
      method: "GET",
      headers: { "Content-Type": "application/json" },
    });
    return response.json();
  },

  getLeaveRequestsByEmployee: async (employeeId: number) => {
    const response = await fetch(
      `${API_BASE_URL}/leave-requests/employee/${employeeId}`,
      {
        method: "GET",
        headers: { "Content-Type": "application/json" },
      },
    );
    return response.json();
  },

  getLeaveRequestsByStatus: async (status: string) => {
    const response = await fetch(
      `${API_BASE_URL}/leave-requests/status/${status}`,
      {
        method: "GET",
        headers: { "Content-Type": "application/json" },
      },
    );
    return response.json();
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
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(lrData),
    });
    return response.json();
  },

  deleteLeaveRequest: async (id: number) => {
    const response = await fetch(`${API_BASE_URL}/leave-requests/${id}`, {
      method: "DELETE",
      headers: { "Content-Type": "application/json" },
    });
    return response.json();
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
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(benData),
    });
    return response.json();
  },

  getAllBenefits: async () => {
    const response = await fetch(`${API_BASE_URL}/benefits`, {
      method: "GET",
      headers: { "Content-Type": "application/json" },
    });
    return response.json();
  },

  getBenefitById: async (id: number) => {
    const response = await fetch(`${API_BASE_URL}/benefits/${id}`, {
      method: "GET",
      headers: { "Content-Type": "application/json" },
    });
    return response.json();
  },

  getBenefitByName: async (name: string) => {
    const response = await fetch(`${API_BASE_URL}/benefits/name/${name}`, {
      method: "GET",
      headers: { "Content-Type": "application/json" },
    });
    return response.json();
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
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(benData),
    });
    return response.json();
  },

  deleteBenefit: async (id: number) => {
    const response = await fetch(`${API_BASE_URL}/benefits/${id}`, {
      method: "DELETE",
      headers: { "Content-Type": "application/json" },
    });
    return response.json();
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
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(ebData),
    });
    return response.json();
  },

  getAllEmployeeBenefits: async () => {
    const response = await fetch(`${API_BASE_URL}/employee-benefits`, {
      method: "GET",
      headers: { "Content-Type": "application/json" },
    });
    return response.json();
  },

  getEmployeeBenefitById: async (id: number) => {
    const response = await fetch(`${API_BASE_URL}/employee-benefits/${id}`, {
      method: "GET",
      headers: { "Content-Type": "application/json" },
    });
    return response.json();
  },

  getEmployeeBenefitsByEmployee: async (employeeId: number) => {
    const response = await fetch(
      `${API_BASE_URL}/employee-benefits/employee/${employeeId}`,
      {
        method: "GET",
        headers: { "Content-Type": "application/json" },
      },
    );
    return response.json();
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
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(ebData),
    });
    return response.json();
  },

  deleteEmployeeBenefit: async (id: number) => {
    const response = await fetch(`${API_BASE_URL}/employee-benefits/${id}`, {
      method: "DELETE",
      headers: { "Content-Type": "application/json" },
    });
    return response.json();
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
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(prData),
    });
    return response.json();
  },

  getAllPayroll: async () => {
    const response = await fetch(`${API_BASE_URL}/payroll`, {
      method: "GET",
      headers: { "Content-Type": "application/json" },
    });
    return response.json();
  },

  getPayrollById: async (id: number) => {
    const response = await fetch(`${API_BASE_URL}/payroll/${id}`, {
      method: "GET",
      headers: { "Content-Type": "application/json" },
    });
    return response.json();
  },

  getPayrollByEmployee: async (employeeId: number) => {
    const response = await fetch(
      `${API_BASE_URL}/payroll/employee/${employeeId}`,
      {
        method: "GET",
        headers: { "Content-Type": "application/json" },
      },
    );
    return response.json();
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
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(prData),
    });
    return response.json();
  },

  deletePayroll: async (id: number) => {
    const response = await fetch(`${API_BASE_URL}/payroll/${id}`, {
      method: "DELETE",
      headers: { "Content-Type": "application/json" },
    });
    return response.json();
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
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(alData),
    });
    return response.json();
  },

  getAllAuditLogs: async () => {
    const response = await fetch(`${API_BASE_URL}/audit-logs`, {
      method: "GET",
      headers: { "Content-Type": "application/json" },
    });
    return response.json();
  },

  getAuditLogById: async (id: number) => {
    const response = await fetch(`${API_BASE_URL}/audit-logs/${id}`, {
      method: "GET",
      headers: { "Content-Type": "application/json" },
    });
    return response.json();
  },

  getAuditLogsByUser: async (userId: number) => {
    const response = await fetch(`${API_BASE_URL}/audit-logs/user/${userId}`, {
      method: "GET",
      headers: { "Content-Type": "application/json" },
    });
    return response.json();
  },

  getAuditLogsByTable: async (tableName: string) => {
    const response = await fetch(
      `${API_BASE_URL}/audit-logs/table/${tableName}`,
      {
        method: "GET",
        headers: { "Content-Type": "application/json" },
      },
    );
    return response.json();
  },

  getAuditLogsByAction: async (action: string) => {
    const response = await fetch(
      `${API_BASE_URL}/audit-logs/action/${action}`,
      {
        method: "GET",
        headers: { "Content-Type": "application/json" },
      },
    );
    return response.json();
  },
};

// ==================== CLOUDINARY ====================
export const cloudinaryApi = {
  uploadImage: async (file: File) => {
    const formData = new FormData();
    formData.append("image", file);
    const response = await fetch(`${API_BASE_URL}/cloud/upload`, {
      method: "POST",
      body: formData,
    });
    return response.json();
  },

  verifyCloudinaryConfig: async () => {
    const response = await fetch(`${API_BASE_URL}/cloud/verify`, {
      method: "GET",
      headers: { "Content-Type": "application/json" },
    });
    return response.json();
  },
};
