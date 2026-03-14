"use client";

import { Download } from "lucide-react";
import { useGetAllAttendance } from "@/hooks/attendance-query";
import { useState, useMemo } from "react";
import * as XLSX from "xlsx";

export default function AttendanceReportsPage() {
  // Select all fields
  const handleSelectAllFields = () => {
    setSelectedFields(fields);
  };
  // Unselect all fields
  const handleUnselectAllFields = () => {
    setSelectedFields([]);
  };
  import {
    Table,
    TableBody,
    TableCell,
    TableHead,
    TableHeader,
    TableRow,
  } from "@/components/ui/table";
  const { data, isLoading, error } = useGetAllAttendance();

  // Get all possible fields from the first data item
  const fields = useMemo(() => {
    if (Array.isArray(data) && data.length > 0) {
      return Object.keys(data[0]);
    }
    return [];
  }, [data]);

  // State for selected fields and reinvented filter
  const [selectedFields, setSelectedFields] = useState<string[]>(fields);
  // Reinvented filter: selected field and value
  const [filterField, setFilterField] = useState<string>(fields[0] || "");
  const [filterValue, setFilterValue] = useState<string>("");

  // Update selected fields
  const handleFieldToggle = (field: string) => {
    setSelectedFields((prev) =>
      prev.includes(field) ? prev.filter((f) => f !== field) : [...prev, field],
    );
  };

  // Update filter field and value
  const handleFilterFieldChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    setFilterField(e.target.value);
  };
  const handleFilterValueChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFilterValue(e.target.value);
  };
  const handleClearFilter = () => {
    setFilterValue("");
    setFilterField(fields[0] || "");
  };

  // Filtered data (reinvented logic)
  const filteredData = useMemo(() => {
    if (!Array.isArray(data)) return [];
    if (!filterField || !filterValue) return data;
    return data.filter((item) => {
      return String(item[filterField] || "")
        .toLowerCase()
        .includes(filterValue.toLowerCase());
    });
  }, [data, filterField, filterValue]);

  // Export to Excel
  const handleExportExcel = () => {
    const exportData = filteredData.map((item) => {
      const row: Record<string, any> = {};
      selectedFields.forEach((field) => {
        row[field] = item[field];
      });
      return row;
    });
    const worksheet = XLSX.utils.json_to_sheet(exportData);
    const workbook = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(workbook, worksheet, "Attendance");
    XLSX.writeFile(workbook, "attendance_report.xlsx");
  };

  // Export to Word (simple table)
  const handleExportWord = () => {
    let html = `<table border="1" style="border-collapse:collapse"><tr>`;
    selectedFields.forEach((field) => {
      html += `<th>${field}</th>`;
    });
    html += `</tr>`;
    filteredData.forEach((item) => {
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
    link.download = "attendance_report.doc";
    link.click();
  };

  return (
    <div>
      <div className="flex items-center justify-between mb-6">
        <h1 className="text-2xl font-bold text-slate-900">
          Attendance Reports
        </h1>
        <div className="flex gap-2">
          <button
            className="bg-linear-to-r from-[#0C4A6E] to-[#075985] text-white px-4 py-2 rounded-lg font-medium hover:shadow-lg transition-all flex items-center gap-2 dark:bg-blue-900/30 dark:text-blue-100 border border-blue-700"
            onClick={handleExportExcel}
          >
            <Download className="h-4 w-4" />
            Excel
          </button>
          <button
            className="bg-linear-to-r from-[#0C4A6E] to-[#075985] text-white px-4 py-2 rounded-lg font-medium hover:shadow-lg transition-all flex items-center gap-2 dark:bg-blue-900/30 dark:text-blue-100 border border-blue-700"
            onClick={handleExportWord}
          >
            <Download className="h-4 w-4" />
            Word
          </button>
        </div>
      </div>

      <div className="bg-white border border-slate-200 rounded-lg p-6 dark:bg-slate-800 dark:border-slate-700">
        {/* Field selection UI */}
        {fields.length > 0 && (
          <div className="mb-4">
            <div className="mb-2 font-semibold text-slate-700">
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
            <div className="flex flex-wrap gap-2">
              {fields.map((field) => (
                <label key={field} className="flex items-center gap-1">
                  <input
                    type="checkbox"
                    checked={selectedFields.includes(field)}
                    onChange={() => handleFieldToggle(field)}
                  />
                  <span className="text-xs text-slate-600">{field}</span>
                </label>
              ))}
            </div>
            <div className="font-semibold text-slate-700 dark:text-slate-200 mb-2">
              Filter:
            </div>
            <div className="flex items-center gap-2">
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

        {isLoading && (
          <p className="text-slate-600">Loading attendance reports...</p>
        )}
        {error && (
          <p className="text-red-600">Error loading attendance reports.</p>
        )}
        {!isLoading &&
          !error &&
          Array.isArray(filteredData) &&
          filteredData.length === 0 && (
            <p className="text-slate-600">No attendance reports found.</p>
          )}
        {!isLoading &&
          !error &&
          Array.isArray(filteredData) &&
          filteredData.length > 0 && (
            <table className="w-full text-sm">
              <thead>
                <tr>
                  {selectedFields.map((field) => (
                    <th
                      key={field}
                      className="px-2 py-1 text-left text-slate-700 border-b"
                    >
                      {field}
                    </th>
              <Table>
                <TableHeader>
                  <TableRow>
                    {selectedFields.map((field) => (
                      <TableHead
                        key={field}
                        className="px-2 py-1 text-left text-slate-700 border-b"
                      >
                        {field}
                      </TableHead>
                    ))}
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {filteredData.map((item, idx) => (
                    <TableRow key={item.id || idx}>
                      {selectedFields.map((field) => (
                        <TableCell
                          key={field}
                          className="px-2 py-1 border-b dark:border-slate-700 dark:text-slate-100"
                        >
                          {String(item[field] ?? "")}
                        </TableCell>
                      ))}
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
                </tr>
              </thead>
              <tbody>
                {filteredData.map((item, idx) => (
                  <tr key={item.id || idx}>
                    {selectedFields.map((field) => (
                      <td
                        key={field}
                        className="px-2 py-1 border-b dark:border-slate-700 dark:text-slate-100"
                      >
                        {String(item[field] ?? "")}
                      </td>
                    ))}
                  </tr>
                ))}
              </tbody>
            </table>
          )}
      </div>
    </div>
  );
}
