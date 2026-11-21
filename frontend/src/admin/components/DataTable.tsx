import React, { useState } from 'react';
import { Search, ChevronLeft, ChevronRight } from 'lucide-react';

export interface Column<T> {
  key: string;
  header: string;
  render?: (row: T) => React.ReactNode;
  align?: 'left' | 'center' | 'right';
  width?: string;
}

interface DataTableProps<T> {
  columns: Column<T>[];
  data: T[];
  searchKey?: keyof T | ((item: T) => string);
  searchPlaceholder?: string;
  filterTabs?: { label: string; value: string }[];
  activeFilter?: string;
  onFilterChange?: (val: string) => void;
  pageSize?: number;
  emptyMessage?: string;
  actions?: React.ReactNode;
  onRowClick?: (row: T) => void;
}

export function DataTable<T>({
  columns,
  data,
  searchKey,
  searchPlaceholder = 'Search records...',
  filterTabs,
  activeFilter,
  onFilterChange,
  pageSize = 10,
  emptyMessage = 'No records found matching your criteria.',
  actions,
  onRowClick,
}: DataTableProps<T>) {
  const [query, setQuery] = useState('');
  const [currentPage, setCurrentPage] = useState(1);

  // Search filtering
  const filteredData = data.filter((item) => {
    if (!query) return true;
    if (typeof searchKey === 'function') {
      return searchKey(item).toLowerCase().includes(query.toLowerCase());
    }
    if (searchKey) {
      const val = (item as any)[searchKey];
      return String(val ?? '').toLowerCase().includes(query.toLowerCase());
    }
    return JSON.stringify(item).toLowerCase().includes(query.toLowerCase());
  });

  const totalPages = Math.ceil(filteredData.length / pageSize) || 1;
  const paginatedData = filteredData.slice((currentPage - 1) * pageSize, currentPage * pageSize);

  return (
    <div className="bg-[#141414] border border-[#242321] rounded-2xl overflow-hidden shadow-2xl font-montserrat">
      {/* Table Toolbar */}
      <div className="p-4 sm:p-5 border-b border-[#242321] flex flex-col md:flex-row md:items-center justify-between gap-4">
        {/* Search Input */}
        <div className="relative flex-1 max-w-sm">
          <Search className="w-4 h-4 text-[#716B63] absolute left-3.5 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            value={query}
            onChange={(e) => {
              setQuery(e.target.value);
              setCurrentPage(1);
            }}
            placeholder={searchPlaceholder}
            className="w-full bg-[#0B0B0B] border border-[#242321] focus:border-[#C85A2E] rounded-xl pl-10 pr-4 py-2.5 text-xs text-[#F4F0E8] placeholder:text-[#716B63] outline-none transition-colors"
          />
        </div>

        {/* Filter Tabs & Actions */}
        <div className="flex items-center gap-3 flex-wrap">
          {filterTabs && (
            <div className="inline-flex bg-[#0B0B0B] p-1 border border-[#242321] rounded-xl">
              {filterTabs.map((tab) => (
                <button
                  key={tab.value}
                  onClick={() => {
                    onFilterChange?.(tab.value);
                    setCurrentPage(1);
                  }}
                  className={`px-3 py-1.5 text-xs font-semibold transition-all rounded-lg cursor-pointer ${
                    activeFilter === tab.value
                      ? 'bg-[#C85A2E] text-white shadow-sm'
                      : 'text-[#A8A29E] hover:text-[#F4F0E8]'
                  }`}
                >
                  {tab.label}
                </button>
              ))}
            </div>
          )}
          {actions}
        </div>
      </div>

      {/* Table Body */}
      <div className="overflow-x-auto">
        <table className="w-full text-left text-xs">
          <thead className="bg-[#100F0E] text-[#716B63] uppercase tracking-wider text-[10px] font-bold border-b border-[#242321]">
            <tr>
              {columns.map((col) => (
                <th
                  key={col.key}
                  style={{ width: col.width }}
                  className={`px-5 py-3.5 font-bold ${
                    col.align === 'right' ? 'text-right' : col.align === 'center' ? 'text-center' : 'text-left'
                  }`}
                >
                  {col.header}
                </th>
              ))}
            </tr>
          </thead>
          <tbody className="divide-y divide-[#242321] text-[#F4F0E8]">
            {paginatedData.length === 0 ? (
              <tr>
                <td colSpan={columns.length} className="px-5 py-12 text-center text-[#716B63]">
                  {emptyMessage}
                </td>
              </tr>
            ) : (
              paginatedData.map((row, idx) => (
                <tr
                  key={(row as any)?.id ? String((row as any).id) : idx}
                  onClick={() => onRowClick?.(row)}
                  className={`transition-colors hover:bg-[#1A1917] ${onRowClick ? 'cursor-pointer' : ''}`}
                >
                  {columns.map((col) => (
                    <td
                      key={col.key}
                      className={`px-5 py-4 whitespace-nowrap ${
                        col.align === 'right' ? 'text-right' : col.align === 'center' ? 'text-center' : 'text-left'
                      }`}
                    >
                      {col.render ? col.render(row) : (row as any)[col.key]}
                    </td>
                  ))}
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>

      {/* Pagination Footer */}
      <div className="p-4 border-t border-[#242321] bg-[#100F0E] flex items-center justify-between text-xs text-[#A8A29E]">
        <div>
          Showing <span className="text-[#F4F0E8] font-bold">{filteredData.length === 0 ? 0 : (currentPage - 1) * pageSize + 1}</span> to{' '}
          <span className="text-[#F4F0E8] font-bold">{Math.min(currentPage * pageSize, filteredData.length)}</span> of{' '}
          <span className="text-[#F4F0E8] font-bold">{filteredData.length}</span> entries
        </div>

        <div className="flex items-center gap-2">
          <button
            onClick={() => setCurrentPage((p) => Math.max(1, p - 1))}
            disabled={currentPage === 1}
            className="p-1.5 rounded-lg border border-[#242321] bg-[#141414] disabled:opacity-40 hover:bg-[#1C1A18] transition-colors cursor-pointer"
          >
            <ChevronLeft className="w-3.5 h-3.5" />
          </button>
          <span className="text-xs text-[#F4F0E8] font-semibold">
            {currentPage} / {totalPages}
          </span>
          <button
            onClick={() => setCurrentPage((p) => Math.min(totalPages, p + 1))}
            disabled={currentPage === totalPages}
            className="p-1.5 rounded-lg border border-[#242321] bg-[#141414] disabled:opacity-40 hover:bg-[#1C1A18] transition-colors cursor-pointer"
          >
            <ChevronRight className="w-3.5 h-3.5" />
          </button>
        </div>
      </div>
    </div>
  );
}
