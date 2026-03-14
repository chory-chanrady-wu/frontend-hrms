"use client";

import { Download } from "lucide-react";
import { payrollApi } from "@/lib/api";
import {
  Table,
  TableHeader,
  TableBody,
  TableRow,
  TableHead,
  TableCell,
} from "@/components/ui/table";
import { useState } from "react";
// Format date as 'DD, MMMM YYYY'
function formatDate(dateString: string | undefined) {
  if (!dateString) return "";
  const date = new Date(dateString);
  if (isNaN(date.getTime())) return dateString;
  return date.toLocaleDateString("en-US", {
    day: "2-digit",
    month: "long",
    year: "numeric",
  });
}
import * as XLSX from "xlsx";

// List of all possible payroll fields (customize as needed)
const ALL_FIELDS = [
  "employeeId",
  "employeeName",
  "baseSalary",
  "bonus",
  "deduction",
  "netSalary",
  "createdAt",
  "updatedAt",
  "month",
  "year",
];

export default function PayrollReportsPage() {
  // Pagination state
  const PAGE_SIZE = 15;
  const [currentPage, setCurrentPage] = useState(1);
  // Select all fields
  const handleSelectAllFields = () => {
    setSelectedFields(ALL_FIELDS);
  };
  // Unselect all fields
  const handleUnselectAllFields = () => {
    setSelectedFields([]);
  };
  // State for selected fields
  const [selectedFields, setSelectedFields] = useState<string[]>(ALL_FIELDS);
  // Update selected fields
  const handleFieldToggle = (field: string) => {
    setSelectedFields((prev) =>
      prev.includes(field) ? prev.filter((f) => f !== field) : [...prev, field],
    );
  };
  // State for fetched payroll data
  const [payrollData, setPayrollData] = useState<any[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // Track if user has generated the report
  const [hasGenerated, setHasGenerated] = useState(false);
  // Generate button handler: fetch payroll data from backend
  const handleGenerate = async () => {
    setLoading(true);
    setError(null);
    setHasGenerated(false);
    setCurrentPage(1); // Reset to first page on generate
    try {
      const res = await payrollApi.getAllPayroll();
      let data = Array.isArray(res)
        ? res
        : Array.isArray(res?.data)
          ? res.data
          : [];
      setPayrollData(data);
      setHasGenerated(true);
    } catch (err: any) {
      setError("Failed to fetch payroll report.");
      setPayrollData([]);
      setHasGenerated(true);
    } finally {
      setLoading(false);
    }
  };

  // Export to Excel
  const handleExportExcel = () => {
    if (!payrollData.length) return;
    const exportData = payrollData.map((item) => {
      const row: Record<string, any> = {};
      selectedFields.forEach((field) => {
        row[field] = item[field];
      });
      return row;
    });
    const worksheet = XLSX.utils.json_to_sheet(exportData);
    const workbook = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(workbook, worksheet, "Payroll");
    XLSX.writeFile(workbook, "payroll_report.xlsx");
  };

  // Export to Word (simple table)
  const handleExportWord = () => {
    if (!payrollData.length) return;
    let html = `<table border="1" style="border-collapse:collapse"><tr>`;
    selectedFields.forEach((field) => {
      html += `<th>${field}</th>`;
    });
    html += `</tr>`;
    payrollData.forEach((item) => {
      html += `<tr>`;
      selectedFields.forEach((field) => {
        html += `<td>${item[field] ?? ""}</td>`;
      });
      html += `</tr>`;
    });
    html += `</table>`;
    const blob = new Blob(
      [`<html><head><meta charset='utf-8'></head><body>${html}</body></html>`],
      { type: "application/msword" },
    );
    const link = document.createElement("a");
    link.href = URL.createObjectURL(blob);
    link.download = "payroll_report.doc";
    link.click();
  };

  return (
    <div>
      <div className="flex items-center justify-between mb-6">
        <h1 className="text-2xl font-bold text-slate-900">Payroll Reports</h1>
        <div className="flex gap-2">
          <button
            className="bg-green-600 text-white px-4 py-2 rounded-lg font-medium hover:shadow-lg transition-all flex items-center gap-2 dark:bg-green-800 dark:text-green-100 border border-green-700 hover:bg-green-700"
            onClick={handleExportExcel}
            disabled={!payrollData.length}
          >
            <Download className="h-4 w-4" />
            Excel
          </button>
          <button
            className="bg-blue-700 text-white px-4 py-2 rounded-lg font-medium hover:shadow-lg transition-all flex items-center gap-2 dark:bg-blue-900 dark:text-blue-100 border border-blue-700 hover:bg-blue-800"
            onClick={handleExportWord}
            disabled={!payrollData.length}
          >
            <Download className="h-4 w-4" />
            Word
          </button>
        </div>
      </div>
      <div className="bg-white border border-slate-200 rounded-lg p-6 dark:bg-slate-800 dark:border-slate-700">
        <div className="mb-4">
          <div className="mb-2 font-semibold text-slate-700 dark:text-slate-200">
            Select fields:
          </div>
          <div className="flex gap-2 mb-2">
            <button
              className="px-2 py-1 text-xs rounded bg-slate-200 dark:bg-slate-600 dark:text-slate-100 border border-slate-300 dark:border-slate-700"
              onClick={handleSelectAllFields}
              type="button"
            >
              Select All
            </button>
            <button
              className="px-2 py-1 text-xs rounded bg-slate-200 dark:bg-slate-600 dark:text-slate-100 border border-slate-300 dark:border-slate-700"
              onClick={handleUnselectAllFields}
              type="button"
            >
              Unselect All
            </button>
          </div>
          <div className="flex flex-wrap gap-2 mb-4">
            {ALL_FIELDS.map((field) => (
              <label key={field} className="flex items-center gap-1">
                <input
                  type="checkbox"
                  checked={selectedFields.includes(field)}
                  onChange={() => handleFieldToggle(field)}
                />
                <span className="text-xs text-black dark:text-slate-300">
                  {field}
                </span>
              </label>
            ))}
          </div>
        </div>
        {/* Pagination logic */}
        {(() => {
          // Only paginate if data is present and generated
          let paginatedData = payrollData;
          let totalPages = 1;
          if (hasGenerated && payrollData.length > 0) {
            totalPages = Math.ceil(payrollData.length / PAGE_SIZE);
            paginatedData = payrollData.slice(
              (currentPage - 1) * PAGE_SIZE,
              currentPage * PAGE_SIZE,
            );
          }
          return (
            <>
              <Table className="mb-4">
                <TableHeader>
                  <TableRow>
                    {selectedFields.map((field) => (
                      <TableHead
                        key={field}
                        className="px-2 py-1 text-left text-black dark:text-white"
                      >
                        {field}
                      </TableHead>
                    ))}
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {loading && (
                    <TableRow>
                      <TableCell
                        colSpan={selectedFields.length}
                        className="text-center py-4 text-slate-500"
                      >
                        Loading report...
                      </TableCell>
                    </TableRow>
                  )}
                  {error && (
                    <TableRow>
                      <TableCell
                        colSpan={selectedFields.length}
                        className="text-center py-4 text-red-500"
                      >
                        {error}
                      </TableCell>
                    </TableRow>
                  )}
                  {/* Only show data if user has generated and there is data */}
                  {hasGenerated &&
                    !loading &&
                    !error &&
                    payrollData.length === 0 && (
                      <TableRow>
                        <TableCell
                          colSpan={selectedFields.length}
                          className="text-center py-4 text-slate-500"
                        >
                          No data found.
                        </TableCell>
                      </TableRow>
                    )}
                  {hasGenerated &&
                    !loading &&
                    !error &&
                    payrollData.length > 0 &&
                    paginatedData.map((row, idx) => (
                      <TableRow key={row.id || idx}>
                        {selectedFields.map((field) => (
                          <TableCell
                            key={field}
                            className="px-2 py-1 dark:border-slate-700 dark:text-slate-100"
                          >
                            {["createdAt", "updatedAt"].includes(field)
                              ? formatDate(row[field])
                              : String(row[field] ?? "")}
                          </TableCell>
                        ))}
                      </TableRow>
                    ))}
                </TableBody>
              </Table>
              {/* Pagination controls */}
              {hasGenerated && payrollData.length > PAGE_SIZE && (
                <div className="flex items-center justify-between px-6 py-3 border-t border-slate-200 dark:border-slate-700">
                  <p className="text-sm text-slate-500 dark:text-slate-400">
                    Showing {(currentPage - 1) * PAGE_SIZE + 1}–
                    {Math.min(currentPage * PAGE_SIZE, payrollData.length)} of{" "}
                    {payrollData.length} records
                  </p>
                  <div className="flex items-center gap-1">
                    <button
                      onClick={() => setCurrentPage((p) => Math.max(1, p - 1))}
                      disabled={currentPage === 1}
                      className="px-3 py-1 text-sm rounded-md border border-slate-300 dark:border-slate-600 text-slate-700 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-700 disabled:opacity-40 disabled:cursor-not-allowed"
                    >
                      Previous
                    </button>
                    {Array.from({ length: totalPages }, (_, i) => i + 1).map(
                      (page) => (
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
                      ),
                    )}
                    <button
                      onClick={() =>
                        setCurrentPage((p) => Math.min(totalPages, p + 1))
                      }
                      disabled={currentPage === totalPages}
                      className="px-3 py-1 text-sm rounded-md border border-slate-300 dark:border-slate-600 text-slate-700 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-700 disabled:opacity-40 disabled:cursor-not-allowed"
                    >
                      Next
                    </button>
                  </div>
                </div>
              )}
            </>
          );
        })()}
        <button
          className="bg-blue-600 text-white px-4 py-2 rounded-lg font-medium hover:shadow-lg transition-all"
          onClick={handleGenerate}
        >
          Generate
        </button>
      </div>
    </div>
  );
}
