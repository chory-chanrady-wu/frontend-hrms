"use client";

import { Download } from "lucide-react";
import { useGetAllAttendance } from "@/hooks/attendance-query";

import { useState, useMemo } from "react";
import * as XLSX from "xlsx";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";

export default function AttendanceReportsPage() {
  // Pagination
  const PAGE_SIZE = 12;
  // Data and fields
  const { data, isLoading, error } = useGetAllAttendance();
  const fields = useMemo(() => {
    if (Array.isArray(data) && data.length > 0) {
      return Object.keys(data[0]);
    }
    return [];
  }, [data]);
  // State
  const [selectedFields, setSelectedFields] = useState<string[]>(fields);
  const [filterField, setFilterField] = useState<string>(fields[0] || "");
  const [filterValue, setFilterValue] = useState<string>("");
  const [currentPage, setCurrentPage] = useState(1);
  const [hasGenerated, setHasGenerated] = useState(false);
  // Select/unselect all
  const handleSelectAllFields = () => setSelectedFields(fields);
  const handleUnselectAllFields = () => setSelectedFields([]);
  // Field toggle
  const handleFieldToggle = (field: string) => {
    setSelectedFields((prev) =>
      prev.includes(field) ? prev.filter((f) => f !== field) : [...prev, field],
    );
  };
  // Filter
  const handleFilterFieldChange = (e: React.ChangeEvent<HTMLSelectElement>) =>
    setFilterField(e.target.value);
  const handleFilterValueChange = (e: React.ChangeEvent<HTMLInputElement>) =>
    setFilterValue(e.target.value);
  const handleClearFilter = () => {
    setFilterValue("");
    setFilterField(fields[0] || "");
  };
  // Filtered data
  const filteredData = useMemo(() => {
    if (!Array.isArray(data)) return [];
    if (!filterField || !filterValue) return data;
    return data.filter((item) => {
      return String(item[filterField] || "")
        .toLowerCase()
        .includes(filterValue.toLowerCase());
    });
  }, [data, filterField, filterValue]);
  // Pagination logic
  const paginatedData = useMemo(() => {
    if (!hasGenerated) return [];
    const start = (currentPage - 1) * PAGE_SIZE;
    return filteredData.slice(start, start + PAGE_SIZE);
  }, [filteredData, currentPage, hasGenerated]);
  const totalPages = Math.max(1, Math.ceil(filteredData.length / PAGE_SIZE));
  // Export to Excel
  // Format date and time as 'DD, MMMM YYYY : hh:mm'
  function formatDateTime(dateString: string | undefined) {
    if (!dateString) return "";
    const date = new Date(dateString);
    if (isNaN(date.getTime())) return dateString;
    const day = date.getDate().toString().padStart(2, "0");
    const month = date.toLocaleString("en-US", { month: "long" });
    const year = date.getFullYear();
    let hours = date.getHours();
    const minutes = date.getMinutes().toString().padStart(2, "0");
    const ampm = hours >= 12 ? "PM" : "AM";
    hours = hours % 12;
    if (hours === 0) hours = 12;
    const hourStr = hours.toString().padStart(2, "0");
    return `${day}, ${month} ${year} : ${hourStr}:${minutes} ${ampm}`;
  }

  // Helper: should a field be formatted as date/time?
  function isDateTimeField(field: string) {
    const normalized = field.toLowerCase();
    return (
      /date|time/.test(normalized) ||
      normalized === "checkin" ||
      normalized === "checkout" ||
      normalized === "createdat"
    );
  }
  const handleExportExcel = () => {
    if (!filteredData.length) return;
    const exportData = filteredData.map((item) => {
      const row: Record<string, any> = {};
      selectedFields.forEach((field) => {
        row[field] = isDateTimeField(field)
          ? formatDateTime(item[field])
          : item[field];
      });
      return row;
    });
    const worksheet = XLSX.utils.json_to_sheet(exportData);
    const workbook = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(workbook, worksheet, "Attendance");
    XLSX.writeFile(workbook, "attendance_report.xlsx");
  };
  // Get user role from localStorage
  let userRole = "";
  const storedUser =
    typeof window !== "undefined" ? localStorage.getItem("user") : null;
  if (storedUser) {
    try {
      const userObj = JSON.parse(storedUser);
      userRole = userObj.role || userObj.roleName || userObj.permission || "";
    } catch {}
  }

  // Only allow admin and hr to view dashboard
  if (userRole.toLowerCase() !== "admin" && userRole.toLowerCase() !== "hr") {
    return (
      <div className="flex flex-col items-center justify-center h-[60vh]">
        <h1 className="text-2xl font-semibold text-red-600 mb-4">
          Not Authorized
        </h1>
        <p className="text-lg text-gray-600">
          You do not have access to the dashboard.
        </p>
      </div>
    );
  }
  // Export to Word
  const handleExportWord = () => {
    if (!filteredData.length) return;
    let html = `<table border="1" style="border-collapse:collapse"><tr>`;
    selectedFields.forEach((field) => {
      html += `<th>${field}</th>`;
    });
    html += `</tr>`;
    filteredData.forEach((item) => {
      html += `<tr>`;
      selectedFields.forEach((field) => {
        const value = isDateTimeField(field)
          ? formatDateTime(item[field])
          : (item[field] ?? "");
        html += `<td>${value}</td>`;
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
    link.download = "attendance_report.doc";
    link.click();
  };
  // Generate button handler
  const handleGenerate = () => {
    setHasGenerated(true);
    setCurrentPage(1);
  };
  return (
    <div>
      <div className="flex items-center justify-between mb-6">
        <h1 className="text-2xl font-bold text-slate-900">
          Attendance Reports
        </h1>
        {hasGenerated && (
          <div className="flex gap-2">
            <button
              className="bg-green-600 text-white px-4 py-2 rounded-lg font-medium hover:shadow-lg transition-all flex items-center gap-2 dark:bg-green-800 dark:text-green-100 border border-green-700 hover:bg-green-700"
              onClick={handleExportExcel}
              disabled={!filteredData.length}
            >
              <Download className="h-4 w-4" />
              Excel
            </button>
            <button
              className="bg-blue-700 text-white px-4 py-2 rounded-lg font-medium hover:shadow-lg transition-all flex items-center gap-2 dark:bg-blue-900 dark:text-blue-100 border border-blue-700 hover:bg-blue-800"
              onClick={handleExportWord}
              disabled={!filteredData.length}
            >
              <Download className="h-4 w-4" />
              Word
            </button>
          </div>
        )}
      </div>
      <div className="bg-white border border-slate-200 rounded-lg p-6 dark:bg-slate-800 dark:border-slate-700">
        {/* Field selection/filter UI */}
        {fields.length > 0 && (
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
              {fields.map((field) => (
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
            <div className="font-semibold text-slate-700 dark:text-slate-200 mb-2">
              Filter:
            </div>
            <div className="flex items-center gap-2 mb-4">
              <select
                className="border border-slate-300 rounded px-2 py-1 text-xs dark:bg-slate-700 dark:text-slate-100"
                value={filterField}
                onChange={handleFilterFieldChange}
              >
                {fields.map((field) => (
                  <option key={field} value={field}>
                    {field}
                  </option>
                ))}
              </select>
              <input
                type="text"
                placeholder={`Filter by ${filterField}`}
                value={filterValue}
                onChange={handleFilterValueChange}
                className="border border-slate-300 rounded px-2 py-1 text-xs dark:bg-slate-700 dark:text-slate-100"
              />
              <button
                className="px-2 py-1 text-xs rounded bg-slate-200 dark:bg-slate-600 dark:text-slate-100 border border-slate-300 dark:border-slate-700"
                onClick={handleClearFilter}
              >
                Clear
              </button>
            </div>
          </div>
        )}
        {/* Table and pagination only after generate */}
        {hasGenerated && (
          <>
            {isLoading ? (
              <div className="text-center py-4 text-slate-500">
                Loading attendance reports...
              </div>
            ) : error ? (
              <div className="text-center py-4 text-red-500">
                Error loading attendance reports.
              </div>
            ) : filteredData.length === 0 ? (
              <div className="text-center py-4 text-slate-500">
                No attendance reports found.
              </div>
            ) : (
              <>
                <Table className="mb-4">
                  <TableHeader>
                    <TableRow>
                      {selectedFields.map((field) => (
                        <TableHead
                          key={field}
                          className="px-2 py-1 text-left text-black dark:text-white"
                        >
                          {field.toUpperCase()}
                        </TableHead>
                      ))}
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {paginatedData.map((item, idx) => (
                      <TableRow key={item.id || idx}>
                        {selectedFields.map((field) => (
                          <TableCell
                            key={field}
                            className="px-2 py-1 dark:border-slate-700 dark:text-slate-100"
                          >
                            {isDateTimeField(field)
                              ? formatDateTime(item[field])
                              : String(item[field] ?? "")}
                          </TableCell>
                        ))}
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
                {/* Pagination controls */}
                {filteredData.length > PAGE_SIZE && (
                  <div className="flex items-center justify-between px-6 py-3 border-t border-slate-200 dark:border-slate-700">
                    <p className="text-sm text-slate-500 dark:text-slate-400">
                      Showing {(currentPage - 1) * PAGE_SIZE + 1}–
                      {Math.min(currentPage * PAGE_SIZE, filteredData.length)}{" "}
                      of {filteredData.length} records
                    </p>
                    <div className="flex items-center gap-1">
                      <button
                        onClick={() =>
                          setCurrentPage((p) => Math.max(1, p - 1))
                        }
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
            )}
          </>
        )}{" "}
        {/* Generate button */}
        <button
          className="bg-blue-600 text-white px-4 py-2 rounded-lg font-medium hover:shadow-lg transition-all mb-4"
          onClick={handleGenerate}
          disabled={isLoading || !fields.length}
        >
          Generate
        </button>
      </div>
    </div>
  );
}
