import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Checkbox } from '@/components/ui/checkbox';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import AppLayout from '@/layouts/app-layout';
import { dateDFY } from '@/lib/utils';
import { SharedData } from '@/types';
import { Absensi } from '@/types/absensi';
import { User } from '@/types/user';
import { Link, usePage } from '@inertiajs/react';
import { Edit, Filter, Folder, FolderArchive, Plus, Trash2 } from 'lucide-react';
import { FC, useState } from 'react';
import AbsensiBulkDeleteDialog from './components/absensi-bulk-delete-dialog';
import AbsensiBulkEditSheet from './components/absensi-bulk-edit-sheet';
import AbsensiFilterSheet from './components/absensi-filter-sheet';
import AbsensiFormSheet from './components/absensi-form-sheet';

type Props = {
  absensis: Absensi[];
  users: User[];
  query: { [key: string]: string };
};

const AbsensiList: FC<Props> = ({ absensis, users, query }) => {
  const [ids, setIds] = useState<number[]>([]);
  const [cari, setCari] = useState('');

  const { permissions } = usePage<SharedData>().props;

  return (
    <AppLayout
      breadcrumbs={[
        {
          title: 'Dashboard',
          href: '/dashboard',
        },
        {
          title: 'Absensi',
          href: route('absensi.index'),
        },
      ]}
      title="Absensis"
      description="Manage your absensis"
      actions={
        <>
          {permissions?.canAdd && (
            <AbsensiFormSheet purpose="create" users={users}>
              <Button>
                <Plus />
                Create new absensi
              </Button>
            </AbsensiFormSheet>
          )}
          <Button variant={'destructive'} size={'icon'} asChild>
            <Link href={route('absensi.archived')}>
              <FolderArchive />
            </Link>
          </Button>
        </>
      }
    >
      <div className="flex gap-2">
        <Input placeholder="Search absensis..." value={cari} onChange={(e) => setCari(e.target.value)} />
        <AbsensiFilterSheet query={query}>
          <Button>
            <Filter />
            Filter data
            {Object.values(query).filter((val) => val && val !== '').length > 0 && (
              <Badge variant="secondary">{Object.values(query).filter((val) => val && val !== '').length}</Badge>
            )}
          </Button>
        </AbsensiFilterSheet>
        {ids.length > 0 && (
          <>
            <Button variant={'ghost'} disabled>
              {ids.length} item selected
            </Button>
            <AbsensiBulkEditSheet absensiIds={ids}>
              <Button>
                <Edit /> Edit selected
              </Button>
            </AbsensiBulkEditSheet>
            <AbsensiBulkDeleteDialog absensiIds={ids}>
              <Button variant={'destructive'}>
                <Trash2 /> Delete selected
              </Button>
            </AbsensiBulkDeleteDialog>
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
                    checked={ids.length === absensis.length}
                    onCheckedChange={(checked) => {
                      if (checked) {
                        setIds(absensis.map((absensi) => absensi.id));
                      } else {
                        setIds([]);
                      }
                    }}
                  />
                </Label>
              </Button>
            </TableHead>
            <TableHead>Hari / Tanggal</TableHead>
            <TableHead className="text-center">Jumlah Kehadiran Karyawan</TableHead>
            <TableHead>Actions</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {absensis
            .filter((absensi) => JSON.stringify(absensi).toLowerCase().includes(cari.toLowerCase()))
            .map((absensi) => (
              <TableRow key={absensi.tanggal}>
                <TableCell>
                  <Button variant={'ghost'} size={'icon'} asChild>
                    <Label>
                      <Checkbox
                        checked={ids.includes(absensi.id)}
                        onCheckedChange={(checked) => {
                          if (checked) {
                            setIds([...ids, absensi.id]);
                          } else {
                            setIds(ids.filter((id) => id !== absensi.id));
                          }
                        }}
                      />
                    </Label>
                  </Button>
                </TableCell>
                <TableCell>{dateDFY(absensi?.tanggal)}</TableCell>
                <TableCell className="text-center">{absensi?.user_counts ?? 0}</TableCell>
                <TableCell>
                  <Button variant={'ghost'} size={'icon'}>
                    <Link href={route('absensi.tanggal.show', { tanggal: String(absensi.tanggal) })}>
                      <Folder />
                    </Link>
                  </Button>
                </TableCell>
              </TableRow>
            ))}
        </TableBody>
      </Table>
    </AppLayout>
  );
};

export default AbsensiList;
