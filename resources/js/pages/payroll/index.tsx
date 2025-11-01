import { Button } from '@/components/ui/button';
import { Checkbox } from '@/components/ui/checkbox';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import AppLayout from '@/layouts/app-layout';
import { periodeBulan } from '@/lib/utils';
import { SharedData } from '@/types';
import { Payroll } from '@/types/payroll';
import { User } from '@/types/user';
import { Link, router, usePage } from '@inertiajs/react';
import { Edit, Folder, Plus, Trash2 } from 'lucide-react';
import { FC, useState } from 'react';
import PayrollAutoGenerateAll from './components/payroll-auto-generate';
import PayrollBulkDeleteDialog from './components/payroll-bulk-delete-dialog';
import PayrollBulkEditSheet from './components/payroll-bulk-edit-sheet';
import PayrollFormSheet from './components/payroll-form-sheet';

type Props = {
  payrolls: Payroll[];
  query: { [key: string]: string };
  users: User[];
  isAdmin: boolean;
};

const PayrollList: FC<Props> = ({ payrolls, query, users, isAdmin }) => {
  const [ids, setIds] = useState<number[]>([]);
  const [cari, setCari] = useState('');

  const { permissions } = usePage<SharedData>().props;
  // console.log('payroll data:', payrolls);

  console.log(
    'map:',
    payrolls.map((p) => p.id),
  );

  return (
    <AppLayout
      breadcrumbs={[
        {
          title: 'Dashboard',
          href: '/dashboard',
        },
        {
          title: 'Payroll',
          href: route('payroll.index'),
        },
      ]}
      title="Payrolls"
      description="Manage your payrolls"
      actions={
        <>
          {/* {permissions?.canAdd && (
          )} */}
          {permissions?.canAdd && (
            <div className="grid grid-cols-1 gap-2 md:grid-cols-2">
              <PayrollFormSheet purpose="create" users={users}>
                <Button>
                  <Plus />
                  Create new payroll
                </Button>
              </PayrollFormSheet>
              <PayrollAutoGenerateAll>
                <Button
                  variant="secondary"
                  onClick={() => {
                    router.post(route('payroll.autoGenerate'));
                  }}
                >
                  <Plus /> Auto Generate Payroll
                </Button>
              </PayrollAutoGenerateAll>
            </div>
          )}
        </>
      }
    >
      <div className="flex gap-2">
        <Input placeholder="Search payrolls..." value={cari} onChange={(e) => setCari(e.target.value)} />
        {/* <PayrollFilterSheet query={query}>
          <Button>
            <Filter />
            Filter data
            {Object.values(query).filter((val) => val && val !== '').length > 0 && (
              <Badge variant="secondary">{Object.values(query).filter((val) => val && val !== '').length}</Badge>
            )}
          </Button>
        </PayrollFilterSheet> */}
        {ids.length > 0 && (
          <>
            <Button variant={'ghost'} disabled>
              {ids.length} item selected
            </Button>
            <PayrollBulkEditSheet payrollIds={ids}>
              <Button>
                <Edit /> Edit selected
              </Button>
            </PayrollBulkEditSheet>
            <PayrollBulkDeleteDialog payrollIds={ids}>
              <Button variant={'destructive'}>
                <Trash2 /> Delete selected
              </Button>
            </PayrollBulkDeleteDialog>
          </>
        )}
      </div>
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>
              <Button variant={'ghost'} size={'icon'} asChild>
                <Label>
                  <Checkbox
                    checked={ids.length === payrolls.length}
                    onCheckedChange={(checked) => {
                      if (checked) {
                        setIds(payrolls.map((payroll) => payroll.id));
                      } else {
                        setIds([]);
                      }
                    }}
                  />
                </Label>
              </Button>
            </TableHead>
            <TableHead>Periode</TableHead>
            {isAdmin && <TableHead>Jumlah Karyawan</TableHead>}
            <TableHead>Actions</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {payrolls
            .filter((payroll) => JSON.stringify(payroll).toLowerCase().includes(cari.toLowerCase()))
            .map((payroll) => (
              <TableRow key={`payroll-${payroll.id}`}>
                <TableCell>
                  <Button variant={'ghost'} size={'icon'} asChild>
                    <Label>
                      <Checkbox
                        checked={ids.includes(payroll.id)}
                        onCheckedChange={(checked) => {
                          if (checked) {
                            setIds([...ids, payroll.id]);
                          } else {
                            setIds(ids.filter((id) => id !== payroll.id));
                          }
                        }}
                      />
                    </Label>
                  </Button>
                </TableCell>
                <TableCell>{periodeBulan(payroll.periode_bulan)}</TableCell>
                {isAdmin && <TableCell>{payroll.jumlah_karyawan}</TableCell>}
                <TableCell>
                  <div className="relative inline-block">
                    <Button variant={'ghost'} size={'icon'}>
                      <Link href={route('payroll.periode.show', { periode: String(payroll.periode_bulan) })}>
                        <Folder />
                      </Link>
                    </Button>
                    {isAdmin && payroll.pending_counts > 0 && (
                      <span className="absolute -top-1 -right-1 flex h-4 w-4 items-center justify-center rounded-full bg-yellow-600 text-[10px] text-white">
                        {payroll.pending_counts}
                      </span>
                    )}
                  </div>
                </TableCell>
              </TableRow>
            ))}
        </TableBody>
      </Table>
    </AppLayout>
  );
};

export default PayrollList;
