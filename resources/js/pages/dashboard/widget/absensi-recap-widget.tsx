// resources/js/Components/RekapAbsensiTable.tsx
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { useSafePagination } from '@/lib/useSafePagination';
import { Link } from '@inertiajs/react';
import { ColumnDef, flexRender, getCoreRowModel, getPaginationRowModel, useReactTable } from '@tanstack/react-table';
import { FC } from 'react';

type RekapAbsensi = {
  id: number;
  name: string;
  divisi: string;
  total_hadir: number;
  total_telat: number;
  total_izin: number;
  total_cuti: number;
  total_alpha: number;
  total_absensi: number;
};

type Props = {
  rekap_absensi?: RekapAbsensi[];
};

const RekapAbsensiTable: FC<Props> = ({ rekap_absensi = [] }) => {
  const columns: ColumnDef<RekapAbsensi>[] = [
    {
      accessorKey: 'name',
      header: 'Nama & Divisi',
      cell: ({ row }) => (
        <Link href={route('user.show', row.original.id)}>
          <Button variant="link">
            {row.original.name} - {row.original.divisi || 'Belum ada divisi'}
          </Button>
        </Link>
      ),
    },
    { accessorKey: 'total_hadir', header: 'Hadir' },
    { accessorKey: 'total_telat', header: 'Telat' },
    { accessorKey: 'total_izin', header: 'Izin' },
    { accessorKey: 'total_cuti', header: 'Cuti' },
    { accessorKey: 'total_alpha', header: 'Alpha' },
    { accessorKey: 'total_absensi', header: 'Total Absensi' },
  ];

  // --- TanStack Table config ---
  const table = useReactTable({
    data: rekap_absensi,
    columns,
    getCoreRowModel: getCoreRowModel(),
    getPaginationRowModel: getPaginationRowModel(),
    initialState: {
      pagination: {
        pageSize: 5,
      },
    },
  });

  const pagination = useSafePagination(table);

  return (
    <div>
      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <div>
              <CardTitle>Rekap Absensi Per Karyawan</CardTitle>
              <CardDescription>Detail kehadiran semua karyawan</CardDescription>
            </div>
            <Link href={route('absensi.index')}>
              <Button variant="outline">Lihat Semua Absensi</Button>
            </Link>
          </div>
        </CardHeader>
        <CardContent>
          <div>
            <div className="overflow-hidden rounded-md border">
              <Table className="min-w-full divide-y">
                <TableHeader>
                  {table.getHeaderGroups().map((headerGroup) => (
                    <TableRow key={headerGroup.id}>
                      {headerGroup.headers.map((header) => (
                        <TableHead key={header.id}>{flexRender(header.column.columnDef.header, header.getContext())}</TableHead>
                      ))}
                    </TableRow>
                  ))}
                </TableHeader>
                <TableBody>
                  {table.getRowModel().rows?.length ? (
                    table.getRowModel().rows.map((row) => (
                      <TableRow key={row.id}>
                        {row.getVisibleCells().map((cell) => (
                          <TableCell key={cell.id}>{flexRender(cell.column.columnDef.cell, cell.getContext())}</TableCell>
                        ))}
                      </TableRow>
                    ))
                  ) : (
                    <TableRow>
                      <TableCell colSpan={columns.length} className="text-center">
                        Tidak ada data absensi karyawan
                      </TableCell>
                    </TableRow>
                  )}
                </TableBody>
              </Table>
            </div>
            <div className="flex items-center justify-center gap-2 p-4 md:justify-end">
              <Button variant={'outline'} size={'sm'} onClick={() => pagination.safePreviousPage()} disabled={!pagination.canPreviousPage}>
                Previous
              </Button>
              <span className="text-sm">
                Page {pagination.pageIndex + 1} of {pagination.pageCount}
              </span>
              <Button variant={'outline'} size={'sm'} onClick={() => pagination.safeNextPage()} disabled={!pagination.canNextPage}>
                Next
              </Button>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default RekapAbsensiTable;
