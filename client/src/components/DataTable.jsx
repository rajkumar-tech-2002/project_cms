import { useState, useMemo } from "react";
import { Search, ChevronLeft, ChevronRight } from "lucide-react";
import { Button } from "@/components/ui/button.jsx";
import { cn } from "@/lib/utils.js";

export default function DataTable({
  columns,
  data,
  pageSize = 10,
  searchableFields = [],
  title,
  onRowClick,
  selectable = false,
  selectedRows = [],
  onSelectRow,
  onSelectAll,
}) {
  const [currentPage, setCurrentPage] = useState(1);
  const [searchTerm, setSearchTerm] = useState("");

  const filteredData = useMemo(() => {
    if (!searchTerm || searchableFields.length === 0) return data;

    return data.filter((row) =>
      searchableFields.some((field) =>
        String(row[field])
          .toLowerCase()
          .includes(searchTerm.toLowerCase())
      )
    );
  }, [data, searchTerm, searchableFields]);

  const totalPages = Math.ceil(filteredData.length / pageSize);
  const paginatedData = filteredData.slice(
    (currentPage - 1) * pageSize,
    currentPage * pageSize
  );

  return (
    <div className="space-y-4">
      {title && (
        <h3 className="text-lg font-semibold text-foreground">{title}</h3>
      )}

      {searchableFields.length > 0 && (
        <div className="relative">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-muted-foreground" />
          <input
            type="text"
            placeholder="Search..."
            value={searchTerm}
            onChange={(e) => {
              setSearchTerm(e.target.value);
              setCurrentPage(1);
            }}
            className="w-full pl-10 pr-4 py-2 border border-input rounded-lg focus:outline-none focus:ring-2 focus:ring-ring"
          />
        </div>
      )}

      <div className="bg-white rounded-lg border border-border overflow-hidden">
        <div className="overflow-x-auto overflow-y-hidden">
          <table className="w-full min-w-[800px] border-collapse">
            <thead>
              <tr className="bg-gray-50 border-b border-border">
                {selectable && (
                  <th className="px-4 py-3">
                    <input
                      type="checkbox"
                      checked={selectedRows.length === paginatedData.length && paginatedData.length > 0}
                      onChange={(e) => onSelectAll?.(e.target.checked, paginatedData)}
                    />
                  </th>
                )}
                {columns.map((column) => (
                  <th
                    key={String(column.key)}
                    className={cn(
                      "px-4 py-3 text-left text-sm font-semibold text-foreground whitespace-nowrap",
                      column.width
                    )}
                  >
                    {column.label}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody>
              {paginatedData.length === 0 ? (
                <tr>
                  <td
                    colSpan={columns.length + (selectable ? 1 : 0)}
                    className="px-4 py-8 text-center text-muted-foreground"
                  >
                    No data found
                  </td>
                </tr>
              ) : (
                paginatedData.map((row, idx) => (
                  <tr
                    key={idx}
                    onClick={() => onRowClick?.(row)}
                    className={cn(
                      "border-b border-border last:border-b-0 transition-colors",
                      onRowClick && "cursor-pointer hover:bg-gray-50"
                    )}
                  >
                    {selectable && (
                      <td className="px-4 py-3">
                        <input
                          type="checkbox"
                          checked={selectedRows.includes(row.id)}
                          onChange={(e) => onSelectRow?.(row.id, e.target.checked)}
                        />
                      </td>
                    )}
                    {columns.map((column) => (
                      <td
                        key={String(column.key)}
                        className="px-4 py-3 text-sm text-foreground whitespace-nowrap"
                      >
                        {column.render
                          ? column.render(row[column.key], row, idx)
                          : row[column.key]}
                      </td>
                    ))}
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>

        {filteredData.length > 0 && (
          <div className="px-4 py-4 border-t border-border flex items-center justify-between">
            <span className="text-sm text-muted-foreground">
              Showing {paginatedData.length === 0 ? 0 : (currentPage - 1) * pageSize + 1} to{" "}
              {Math.min(currentPage * pageSize, filteredData.length)} of{" "}
              {filteredData.length} results
            </span>
            <div className="flex items-center gap-2">
              <Button
                variant="outline"
                size="sm"
                onClick={() => setCurrentPage(Math.max(1, currentPage - 1))}
                disabled={currentPage === 1}
              >
                <ChevronLeft className="w-4 h-4" />
              </Button>
              <span className="text-sm text-foreground">
                Page {currentPage} of {totalPages}
              </span>
              <Button
                variant="outline"
                size="sm"
                onClick={() => setCurrentPage(Math.min(totalPages, currentPage + 1))}
                disabled={currentPage === totalPages}
              >
                <ChevronRight className="w-4 h-4" />
              </Button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
