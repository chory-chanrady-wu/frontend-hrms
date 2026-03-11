"use client";

import { Download } from "lucide-react";
import { useGetAllAuditLogs } from "@/hooks/audit-log-query";

import { useState, useMemo } from "react";

export default function PerformanceReportsPage() {
  const { data, isLoading, error } = useGetAllAuditLogs();

  // Get all possible fields from the first data item
  const fields = useMemo(() => {
    if (Array.isArray(data) && data.length > 0) {
      return Object.keys(data[0]);
    }
    return [];
  }, [data]);

  // State for selected fields and filter values
  const [selectedFields, setSelectedFields] = useState<string[]>(fields);
  const [filters, setFilters] = useState<Record<string, string>>({});

  // Update selected fields
  const handleFieldToggle = (field: string) => {
    setSelectedFields((prev) =>
      prev.includes(field) ? prev.filter((f) => f !== field) : [...prev, field],
    );
  };

  // Update filter value
  const handleFilterChange = (field: string, value: string) => {
    setFilters((prev) => ({ ...prev, [field]: value }));
  };

  // Filtered data
  const filteredData = useMemo(() => {
    if (!Array.isArray(data)) return [];
    return data.filter((item) =>
      fields.every((field) => {
        if (!filters[field]) return true;
        return String(item[field] || "")
          .toLowerCase()
          .includes(String(filters[field]).toLowerCase());
      }),
    );
  }, [data, filters, fields]);

  return (
    <div>
      <div className="flex items-center justify-between mb-6">
        <h1 className="text-2xl font-bold text-slate-900">
          Performance Reports
        </h1>
        <button className="bg-gradient-to-r from-[#0C4A6E] to-[#075985] text-white px-4 py-2 rounded-lg font-medium hover:shadow-lg transition-all flex items-center gap-2">
          <Download className="h-4 w-4" />
          Download
        </button>
      </div>

      <div className="bg-white border border-slate-200 rounded-lg p-6">
        {/* Field selection UI */}
        {fields.length > 0 && (
          <div className="mb-4">
            <div className="mb-2 font-semibold text-slate-700">
              Select fields:
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
            <div className="mt-4 font-semibold text-slate-700">Filter:</div>
            <div className="flex flex-wrap gap-2">
              {fields.map((field) => (
                <input
                  key={field}
                  type="text"
                  placeholder={`Filter by ${field}`}
                  value={filters[field] || ""}
                  onChange={(e) => handleFilterChange(field, e.target.value)}
                  className="border border-slate-300 rounded px-2 py-1 text-xs"
                />
              ))}
            </div>
          </div>
        )}

        {isLoading && (
          <p className="text-slate-600">Loading performance reports...</p>
        )}
        {error && (
          <p className="text-red-600">Error loading performance reports.</p>
        )}
        {!isLoading &&
          !error &&
          Array.isArray(filteredData) &&
          filteredData.length === 0 && (
            <p className="text-slate-600">No performance reports found.</p>
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
                  ))}
                </tr>
              </thead>
              <tbody>
                {filteredData.map((item, idx) => (
                  <tr key={item.id || idx}>
                    {selectedFields.map((field) => (
                      <td key={field} className="px-2 py-1 border-b">
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
