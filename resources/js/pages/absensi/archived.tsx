import { Button } from '@/components/ui/button';
import { Checkbox } from '@/components/ui/checkbox';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import StatusBadge from '@/components/ui/status-badge';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import AppLayout from '@/layouts/app-layout';
import { em } from '@/lib/utils';
import { Absensi } from '@/types/absensi';
import { Link, router } from '@inertiajs/react';
import { ArrowLeft, Trash2, Undo2 } from 'lucide-react';
import { FC, useState } from 'react';
import { toast } from 'sonner';

type Props = {
  absensis: Absensi[];
};

const ArchivedAbsensiList: FC<Props> = ({ absensis }) => {
  const [ids, setIds] = useState<number[]>([]);
  const [cari, setCari] = useState('');

  const handleRestore = (id: Absensi['id']) => {
    router.put(
      route('absensi.restore', id),
      {},
      {
        preserveScroll: true,
        onSuccess: () => toast.success('Data berhasil di restore!'),
        onError: (e) => toast.error(em(e)),
      },
    );
  };

  const handleForceDelete = (id: Absensi['id']) => {
    router.delete(route('absensi.force-delete', id), {
      preserveScroll: true,
      onSuccess: () => toast.success('Data berhasil di hapus permanen!'),
      onError: (e) => toast.error(em(e)),
    });
  };

  return (
    <AppLayout
      title="Absensi Arsip"
      description="Manage archived absensi"
      actions={
        <Button variant={'secondary'} asChild>
          <Link href={route('absensi.index')}>
            <ArrowLeft />
            Kembali ke list
          </Link>
        </Button>
      }
    >
      <div className="flex gap-2">
        <Input placeholder="Search absensis..." value={cari} onChange={(e) => setCari(e.target.value)} />
        {ids.length > 0 && (
          <>
            <Button variant={'ghost'} disabled>
              {ids.length} item selected
            </Button>
          </>
        )}
      </div>

      {/* ADD LOADING/EMPTY STATE */}
      {!absensis || absensis.length === 0 ? (
        <div className="py-8 text-center">
          <p className="text-gray-500">Tidak ada data absensi yang diarsipkan</p>
        </div>
      ) : (
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
              <TableHead>No</TableHead>
              <TableHead>Nama Karyawan</TableHead>
              <TableHead>Tanggal</TableHead>
              <TableHead>Status</TableHead>
              <TableHead>Disetujui Oleh</TableHead>
              <TableHead>Approval Status</TableHead>
              <TableHead>Action</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {absensis
              .filter((absensi) => JSON.stringify(absensi).toLowerCase().includes(cari.toLowerCase()))
              .map((absensi, i) => (
                <TableRow key={absensi.id}>
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
                  <TableCell>{i + 1}</TableCell>
                  <TableCell>{absensi.user?.name}</TableCell>
                  <TableCell>{absensi.tanggal}</TableCell>
                  <TableCell>
                    <StatusBadge status={absensi.status || ''} />
                  </TableCell>

                  <TableCell>{(absensi.approval_status !== 'Pending' && absensi.approved_by?.name) || '-'}</TableCell>
                  <TableCell>
                    <StatusBadge status={absensi.approval_status} />
                  </TableCell>
                  <TableCell>
                    <Button variant={'ghost'} size={'icon'} onClick={() => handleRestore(absensi.id)}>
                      <Undo2 />
                    </Button>
                    <Button variant={'ghost'} size={'icon'} onClick={() => handleForceDelete(absensi.id)}>
                      <Trash2 />
                    </Button>
                  </TableCell>
                </TableRow>
              ))}
          </TableBody>
        </Table>
      )}
    </AppLayout>
  );
};

export default ArchivedAbsensiList;
