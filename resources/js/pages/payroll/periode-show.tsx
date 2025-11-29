import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Checkbox } from '@/components/ui/checkbox';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import StatusBadge from '@/components/ui/status-badge';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import AppLayout from '@/layouts/app-layout';
import { capitalizeWords, formatRupiah } from '@/lib/utils';
import { SharedData } from '@/types';
import { Payroll } from '@/types/payroll';
import { User } from '@/types/user';
import { Link, usePage } from '@inertiajs/react';
import { Edit, Filter, Folder, Plus, Trash2 } from 'lucide-react';
import { FC, useState } from 'react';
import PayrollBulkDeleteDialog from './components/payroll-bulk-delete-dialog';
import PayrollBulkEditSheet from './components/payroll-bulk-edit-sheet';
import PayrollDeleteDialog from './components/payroll-delete-dialog';
import PayrollFilterSheet from './components/payroll-filter-sheet';
import PayrollFormSheet from './components/payroll-form-sheet';

type Props = {
  payrolls: Payroll[];
  query: { [key: string]: string };
  users: User[];
};

const PayrollUserList: FC<Props> = ({ payrolls, query = {}, users }) => {
  const [ids, setIds] = useState<number[]>([]);
  const [cari, setCari] = useState('');

  const { permissions } = usePage<SharedData>().props;
  // console.log('Payroll data:', payrolls);

  // console.log('Payrolls data structure:', payrolls);
  // console.log('payrolls variable:', payrolls);
  // console.log('payrolls length:', payrolls?.length);
  // console.log('payrolls type:', typeof payrolls);
  // console.log('Available properties:', Object.keys(payrolls[0]));

  console.log('=== PERIODE-SHOW DEBUG ===');
  console.log('Payrolls count:', payrolls.length);
  console.log('Sample payroll:', payrolls[0]);
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
        {
          title: `Detail Payroll `,
          href: route('payroll.index'),
        },
      ]}
      title="Payrolls"
      description="Manage your payrolls"
      actions={
        <>
          {permissions?.canAdd && (
            <PayrollFormSheet purpose="create" users={users}>
              <Button>
                <Plus />
                Create new payroll
              </Button>
            </PayrollFormSheet>
          )}
        </>
      }
    >
      <div className="flex gap-2">
        <Input placeholder="Search payrolls..." value={cari} onChange={(e) => setCari(e.target.value)} />
        <PayrollFilterSheet query={query}>
          <Button>
            <Filter />
            Filter data
            {Object.values(query).filter((val) => val && val !== '').length > 0 && (
              <Badge variant="secondary">{Object.values(query).filter((val) => val && val !== '').length}</Badge>
            )}
          </Button>
        </PayrollFilterSheet>
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
            <TableHead>Nama</TableHead>
            <TableHead>Jabatan</TableHead>
            <TableHead>Gaji Pokok</TableHead>
            <TableHead>Tanggal Pengajuan</TableHead>
            <TableHead>Status</TableHead>
            <TableHead>Approval Status</TableHead>
            <TableHead>Actions</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {payrolls
            .filter((payroll) => JSON.stringify(payroll).toLowerCase().includes(cari.toLowerCase()))
            .map((payroll) => {
              console.log('Payroll item:', payroll);
              console.log('Payroll item:', payroll.user.roles);

              return (
                <TableRow key={payroll.id}>
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
                  <TableCell>{payroll.user.name}</TableCell>
                  <TableCell>{capitalizeWords(payroll.user.roles?.[0]?.name || '-')}</TableCell>
                  <TableCell>{formatRupiah(payroll.user.custom_gaji_pokok)}</TableCell>
                  <TableCell>{payroll.tanggal}</TableCell>
                  <TableCell>
                    <StatusBadge status={payroll.status} />
                  </TableCell>
                  <TableCell>
                    <StatusBadge status={payroll.approval_status} />
                  </TableCell>
                  <TableCell>
                    {permissions?.canShow && (
                      <Button variant={'ghost'} size={'icon'}>
                        <Link href={route('payroll.user.show', { periode: payroll.periode, user: payroll.user.id })}>
                          <Folder />
                        </Link>
                      </Button>
                    )}
                    {permissions?.canDelete && (
                      <PayrollDeleteDialog payroll={payroll}>
                        <Button variant={'ghost'} size={'icon'}>
                          <Trash2 />
                        </Button>
                      </PayrollDeleteDialog>
                    )}
                  </TableCell>
                </TableRow>
              );
            })}
        </TableBody>
      </Table>
    </AppLayout>
  );
};

export default PayrollUserList;
