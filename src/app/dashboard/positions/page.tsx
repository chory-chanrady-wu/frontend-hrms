"use client";
import { useGetAllPositions } from "@/hooks/position-query";
import { useGetAllDepartments } from "@/hooks/department-query";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { useDeletePosition } from "@/hooks/position-query";
import { themedSwal } from "@/components/ui/ThemedSwal";
import { Edit, Trash2 } from "lucide-react";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";

const PAGE_SIZE = 10;

export default function PositionsPage() {
  const router = useRouter();
  const { data: positionsResponse, isLoading, error } = useGetAllPositions();
  const { data: departmentsResponse } = useGetAllDepartments();
  const [currentPage, setCurrentPage] = useState(1);

  const positions = Array.isArray(positionsResponse)
    ? positionsResponse
    : Array.isArray(positionsResponse?.data)
      ? positionsResponse.data
      : [];
  const departments = Array.isArray(departmentsResponse)
    ? departmentsResponse
    : Array.isArray(departmentsResponse?.data)
      ? departmentsResponse.data
      : [];

  const totalPages = Math.ceil(positions.length / PAGE_SIZE);
  const paginatedPositions = positions.slice(
    (currentPage - 1) * PAGE_SIZE,
    currentPage * PAGE_SIZE,
  );

  const getDepartmentName = (deptId: number, fallbackName?: string) => {
    const dept = departments.find(
      (d: { id: number; name: string }) => d.id === deptId,
    );
    if (dept) return dept.name;
    if (fallbackName) return fallbackName;
    return deptId;
  };
  
  const deletePosition = useDeletePosition();
  // Handle delete action with confirmation
  const handleDelete = async (id: number) => {
    const result = await themedSwal({
      title: "Are you sure?",
      text: "This will permanently delete the position.",
      icon: "warning",
      showCancelButton: true,
      confirmButtonText: "Yes, delete it!",
      cancelButtonText: "Cancel",
      reverseButtons: true,
    });
    if (result.isConfirmed) {
      try {
        await deletePosition.mutateAsync(id);
        themedSwal({
          title: "Deleted!",
          text: "Position has been deleted.",
          icon: "success",
          timer: 1500,
          showConfirmButton: false,
        });
      } catch (err: any) {
        themedSwal({
          title: "Error",
          text: err?.message || "Failed to delete position.",
          icon: "error",
        });
      }
    }
  };

  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-64">
        <span className="text-blue-600">Loading...</span>
      </div>
    );
  }

  if (error) {
    return (
      <div className="text-center py-12 text-red-500">
        Failed to load positions. Please try again later.
      </div>
    );
  }

  return (
    <div>
      <div className="flex items-center justify-between mb-6">
        <h1 className="text-2xl font-bold text-slate-900 dark:text-slate-100">
          Positions
        </h1>
        <Link
          href="/dashboard/positions/add"
          className="bg-blue-600 text-white px-4 py-2 rounded-lg font-medium hover:bg-blue-700 transition-all"
        >
          Add Position
        </Link>
      </div>
      <div className="bg-white border border-slate-200 rounded-lg overflow-hidden dark:bg-slate-800 dark:border-slate-700">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead className="px-6 py-3 text-left text-xs font-medium text-slate-500 uppercase tracking-wider dark:text-slate-300">
                #
              </TableHead>
              <TableHead className="px-6 py-3 text-left text-xs font-medium text-slate-500 uppercase tracking-wider dark:text-slate-300">
                Position Name
              </TableHead>
              <TableHead className="px-6 py-3 text-left text-xs font-medium text-slate-500 uppercase tracking-wider dark:text-slate-300">
                Department
              </TableHead>
              <TableHead className="px-6 py-3 text-left text-xs font-medium text-slate-500 uppercase tracking-wider dark:text-slate-300">
                Line Manager
              </TableHead>
              <TableHead className="px-6 py-3 text-center text-xs font-medium text-slate-500 uppercase tracking-wider dark:text-slate-300">
                Actions
              </TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {positions.length === 0 ? (
              <TableRow>
                <TableCell
                  colSpan={5}
                  className="px-6 py-8 text-center text-sm text-slate-500 dark:text-slate-400"
                >
                  No positions found.
                </TableCell>
              </TableRow>
            ) : (
              paginatedPositions.map(
                (
                  pos: {
                    id: number;
                    positionName: string;
                    departmentId?: number;
                    departmentName?: string;
                    headOfDepartmentName?: string;
                  },
                  idx: number,
                ) => {
                  if (idx === 0) {
                    // Only log the first row to avoid spamming the console
                    console.log("Position row sample:", pos);
                  }
                  const deptId = pos.departmentId;
                  return (
                    <TableRow
                      key={pos.id}

                      className="hover:bg-slate-50 dark:hover:bg-slate-700 cursor-pointer"
                    >
                      <TableCell className="px-6 py-4 whitespace-nowrap">
                        {(currentPage - 1) * PAGE_SIZE + idx + 1}
                      </TableCell>
                      <TableCell className="px-6 py-4 whitespace-nowrap font-medium text-slate-900 dark:text-slate-100">
                        {pos.positionName}
                      </TableCell>
                      <TableCell className="px-6 py-4 whitespace-nowrap text-slate-700 dark:text-slate-300">
                        {typeof deptId === "number"
                          ? getDepartmentName(deptId, pos.departmentName)
                          : pos.departmentName || "-"}
                      </TableCell>
                      <TableCell className="px-6 py-4 whitespace-nowrap text-slate-700 dark:text-slate-300">
                        {/* Fallback: if pos.headOfDepartmentName is missing, try to get from department */}
                        {pos.headOfDepartmentName ||
                          (() => {
                            if (typeof deptId === "number") {
                              const dept = departments.find(
                                (d: any) => d.id === deptId,
                              );
                              if (dept && dept.headOfDepartmentName) {
                                return dept.headOfDepartmentName;
                              }
                            }
                            return "-";
                          })()}
                      </TableCell>
                      <TableCell className="px-6 py-4 whitespace-nowrap text-center text-sm font-medium">
                        <div
                          className="flex justify-center gap-2"
                          onClick={(e) => e.stopPropagation()}
                        >
                          <Link
                            href={`/dashboard/positions/${pos.id}/edit`}
                            className="text-blue-600 hover:text-blue-900 dark:text-blue-400 dark:hover:text-blue-300"
                          >
                            <Edit className="h-4 w-4" />
                          </Link>
                          <button
                            onClick={(e) => {
                              e.stopPropagation();
                              handleDelete(pos.id);
                            }}
                            className="text-red-600 hover:text-red-900 dark:text-red-400 dark:hover:text-red-300"
                            disabled={deletePosition.status === "pending"}
                          >
                            <Trash2 className="h-4 w-4" />
                          </button>
                        </div>
                      </TableCell>
                    </TableRow>
                  );
                },
              )
            )}
          </TableBody>
        </Table>
      </div>
      {/* Pagination */}
      {totalPages > 1 && (
        <div className="flex items-center justify-between mt-4">
          <p className="text-sm text-slate-500 dark:text-slate-400">
            Showing {(currentPage - 1) * PAGE_SIZE + 1}–
            {Math.min(currentPage * PAGE_SIZE, positions.length)} of{" "}
            {positions.length} positions
          </p>
          <div className="flex items-center gap-1">
            <button
              onClick={() => setCurrentPage((p) => Math.max(1, p - 1))}
              disabled={currentPage === 1}
              className="px-3 py-1 text-sm rounded-md border border-slate-300 dark:border-slate-600 text-slate-700 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-700 disabled:opacity-40 disabled:cursor-not-allowed"
            >
              Previous
            </button>
            {Array.from({ length: totalPages }, (_, i) => i + 1).map((page) => (
              <button
                key={page}
                onClick={() => setCurrentPage(page)}
                className={`px-3 py-1 text-sm rounded-md ${
                  page === currentPage
                    ? "bg-blue-600 text-white"
                    : "border border-slate-300 dark:border-slate-600 text-slate-700 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-700"
                }`}
              >
                {page}
              </button>
            ))}
            <button
              onClick={() => setCurrentPage((p) => Math.min(totalPages, p + 1))}
              disabled={currentPage === totalPages}
              className="px-3 py-1 text-sm rounded-md border border-slate-300 dark:border-slate-600 text-slate-700 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-700 disabled:opacity-40 disabled:cursor-not-allowed"
            >
              Next
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
