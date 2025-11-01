import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Checkbox } from '@/components/ui/checkbox';
import { HoverCard, HoverCardContent, HoverCardTrigger } from '@/components/ui/hover-card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import StatusBadge from '@/components/ui/status-badge';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import AppLayout from '@/layouts/app-layout';
import { SharedData } from '@/types';
import { Cuti } from '@/types/cuti';
import { User } from '@/types/user';
import { Link, usePage } from '@inertiajs/react';
import { Edit, Filter, Folder, FolderArchive, Plus, Trash2 } from 'lucide-react';
import { FC, useState } from 'react';
import CutiBulkDeleteDialog from './components/cuti-bulk-delete-dialog';
import CutiBulkEditSheet from './components/cuti-bulk-edit-sheet';
import CutiDeleteDialog from './components/cuti-delete-dialog';
import CutiFilterSheet from './components/cuti-filter-sheet';
import CutiFormSheet from './components/cuti-form-sheet';

type Props = {
  cutis: Cuti[];
  query: { [key: string]: string };
  users: User[];
  isAdmin: boolean;
};

const CutiList: FC<Props> = ({ cutis, query, users, isAdmin }) => {
  const [ids, setIds] = useState<number[]>([]);
  const [cari, setCari] = useState('');

  const { permissions } = usePage<SharedData>().props;

  console.log('🔍 CutiList Props:', {
    isAdmin,
    usersCount: users.length,
    cutisCount: cutis.length,
    cutis: cutis.map((c) => ({ id: c.id, userName: c.user?.name })),
  });

  return (
    <AppLayout
      breadcrumbs={[
        {
          title: 'Dashboard',
          href: '/dashboard',
        },
        {
          title: 'Cuti',
          href: route('cuti.index'),
        },
      ]}
      title={isAdmin ? 'Data Cuti Karyawan' : 'Cuti Saya'} // ← DYNAMIC TITLE
      description={isAdmin ? 'Manage cuti semua karyawan' : 'Kelola pengajuan cuti Anda'} // ← DYNAMIC DESC
      actions={
        <>
          {permissions?.canAdd && (
            <CutiFormSheet purpose="create" users={isAdmin ? users : []}>
              <Button>
                <Plus />
                {isAdmin ? 'Tambah Cuti' : 'Ajukan Cuti'} {/* ← DYNAMIC BUTTON TEXT */}
              </Button>
            </CutiFormSheet>
          )}
          {/* Sembunyikan archive button untuk user biasa jika tidak perlu */}
          {permissions?.canArchived && (
            <Button variant={'destructive'} size={'icon'} asChild>
              <Link href={route('cuti.archived')}>
                <FolderArchive />
              </Link>
            </Button>
          )}
        </>
      }
    >
      <div className="flex gap-2">
        <Input placeholder="Cari cuti..." value={cari} onChange={(e) => setCari(e.target.value)} />

        {/* Filter hanya untuk admin */}
        {isAdmin && (
          <CutiFilterSheet query={query}>
            <Button>
              <Filter />
              Filter data
              {Object.values(query).filter((val) => val && val !== '').length > 0 && (
                <Badge variant="secondary">{Object.values(query).filter((val) => val && val !== '').length}</Badge>
              )}
            </Button>
          </CutiFilterSheet>
        )}

        {/* Bulk actions hanya untuk admin */}
        {isAdmin && ids.length > 0 && (
          <>
            <Button variant={'ghost'} disabled>
              {ids.length} item selected
            </Button>
            <CutiBulkEditSheet cutiIds={ids}>
              <Button>
                <Edit /> Edit selected
              </Button>
            </CutiBulkEditSheet>
            <CutiBulkDeleteDialog cutiIds={ids}>
              <Button variant={'destructive'}>
                <Trash2 /> Delete selected
              </Button>
            </CutiBulkDeleteDialog>
          </>
        )}
      </div>

      <Table>
        <TableHeader>
          <TableRow>
            {/* Checkbox hanya untuk admin */}
            {isAdmin && (
              <TableHead>
                <Button variant={'ghost'} size={'icon'} asChild>
                  <Label>
                    <Checkbox
                      checked={ids.length === cutis.length}
                      onCheckedChange={(checked) => {
                        if (checked) {
                          setIds(cutis.map((cuti) => cuti.id));
                        } else {
                          setIds([]);
                        }
                      }}
                    />
                  </Label>
                </Button>
              </TableHead>
            )}
            {/* Kolom "Nama karyawan" hanya untuk admin */}
            {isAdmin && <TableHead>Nama karyawan</TableHead>}
            <TableHead>Tanggal pengajuan</TableHead>
            <TableHead>Jumlah hari</TableHead>
            <TableHead>Keterangan cuti</TableHead>
            {isAdmin && <TableHead>Disetujui oleh</TableHead>}
            <TableHead>Status approval</TableHead>
            <TableHead>Actions</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {cutis
            .filter((cuti) => JSON.stringify(cuti).toLowerCase().includes(cari.toLowerCase()))
            .map((cuti) => (
              <TableRow key={cuti.id}>
                {/* Checkbox hanya untuk admin */}
                {isAdmin && (
                  <TableCell>
                    <Button variant={'ghost'} size={'icon'} asChild>
                      <Label>
                        <Checkbox
                          checked={ids.includes(cuti.id)}
                          onCheckedChange={(checked) => {
                            if (checked) {
                              setIds([...ids, cuti.id]);
                            } else {
                              setIds(ids.filter((id) => id !== cuti.id));
                            }
                          }}
                        />
                      </Label>
                    </Button>
                  </TableCell>
                )}
                {/* Nama karyawan hanya untuk admin */}
                {isAdmin && <TableCell>{cuti.user?.name}</TableCell>}
                <TableCell>{cuti.tgl_pengajuan}</TableCell>
                <TableCell>{cuti.jumlah_hari} Hari</TableCell>
                <TableCell>
                  <HoverCard>
                    <HoverCardTrigger className="line-clamp-1 w-40 truncate">
                      {cuti.jenis_cuti} - {cuti.alasan || '-'}
                    </HoverCardTrigger>
                    <HoverCardContent className="min-w-fit">
                      <div className="flex justify-between gap-4">
                        <div className="space-y-1">
                          <h4 className="text-sm font-semibold">
                            <StatusBadge status={cuti.jenis_cuti || ''} />
                          </h4>
                          <p className="line-clamp-3">{cuti.alasan}</p>
                        </div>
                      </div>
                    </HoverCardContent>
                  </HoverCard>
                </TableCell>
                {isAdmin && <TableCell>{cuti.approved_by?.name}</TableCell>}
                <TableCell>
                  <StatusBadge status={cuti.approval_status} />
                </TableCell>
                <TableCell>
                  {permissions?.canShow && (
                    <Button variant={'ghost'} size={'icon'}>
                      <Link href={route('cuti.show', cuti.id)}>
                        <Folder />
                      </Link>
                    </Button>
                  )}
                  {permissions?.canUpdate && (
                    <>
                      <CutiFormSheet purpose="edit" cuti={cuti}>
                        <Button variant={'ghost'} size={'icon'}>
                          <Edit />
                        </Button>
                      </CutiFormSheet>
                    </>
                  )}
                  {permissions?.canDelete && (
                    <CutiDeleteDialog cuti={cuti}>
                      <Button variant={'ghost'} size={'icon'}>
                        <Trash2 />
                      </Button>
                    </CutiDeleteDialog>
                  )}
                </TableCell>
              </TableRow>
            ))}
        </TableBody>
      </Table>
    </AppLayout>
  );
};

export default CutiList;
