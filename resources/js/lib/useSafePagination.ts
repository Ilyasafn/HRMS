import { Table } from '@tanstack/react-table';

export function useSafePagination<T>(table: Table<T>) {
  const safeNextPage = () => {
    if (table.getCanNextPage()) table.nextPage();
  };

  const safePreviousPage = () => {
    if (table.getCanPreviousPage()) table.previousPage();
  };

  return {
    safeNextPage,
    safePreviousPage,
    pageIndex: table.getState().pagination.pageIndex,
    pageCount: table.getPageCount(),
    canNextPage: table.getCanNextPage(),
    canPreviousPage: table.getCanPreviousPage(),
  };
}
