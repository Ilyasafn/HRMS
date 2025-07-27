import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Table, TableBody, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import AppLayout from '@/layouts/app-layout';
import { formatDate } from '@/lib/utils';
import { Divisi, Jabatan, Karyawan } from '@/types';
import { Edit, Plus, Trash } from 'lucide-react';
import { useState } from 'react';
import DeleteKaryawanAlertDialog from './components/delete-karyawan-alert-dialog';
import KaryawanFormDialog from './components/karyawan-form-dialog';

const KaryawanList = ({ karyawans, divisis, jabatans }: { karyawans: Karyawan[]; divisis: Divisi[]; jabatans: Jabatan[] }) => {
    const [cari, setCari] = useState('');
    return (
        <AppLayout
            breadcrumbs={[
                {
                    title: 'Dashboard',
                    href: '/dashboard',
                },
                {
                    title: 'Karyawan',
                    href: route('karyawan.index'),
                },
            ]}
        >
            <div className="p-4">
                <div className="flex gap-4">
                    <Input placeholder="Cari karyawan..." value={cari} onChange={(e) => setCari(e.target.value)} />
                    <KaryawanFormDialog divisis={divisis} jabatans={jabatans} purpose="tambah">
                        <Button>
                            <Plus /> Tambah Karyawan
                        </Button>
                    </KaryawanFormDialog>
                </div>
                <Table>
                    <TableHeader>
                        <TableRow>
                            <TableHead>No</TableHead>
                            <TableHead>Nama</TableHead>
                            <TableHead>NIK</TableHead>
                            <TableHead>Divisi</TableHead>
                            <TableHead>Jabatan</TableHead>
                            <TableHead>Tanggal masuk</TableHead>
                            <TableHead>Alamat</TableHead>
                            <TableHead>Phone</TableHead>
                            <TableHead>Status</TableHead>
                            <TableHead>Action</TableHead>
                        </TableRow>
                    </TableHeader>
                    <TableBody>
                        {karyawans
                            .filter((karyawans) => karyawans.nama.includes(cari))
                            .map((karyawan, index) => (
                                <TableRow key={karyawan.id}>
                                    <TableHead>{index + 1}</TableHead>
                                    <TableHead>{karyawan.nama}</TableHead>
                                    <TableHead>{karyawan.nik}</TableHead>
                                    <TableHead>{karyawan.divisi?.nama || 'N/A'}</TableHead>
                                    <TableHead>{karyawan.jabatan?.nama || 'N/A'}</TableHead>
                                    <TableHead>{formatDate(karyawan.tgl_masuk) || 'N/A'}</TableHead>
                                    <TableHead>{karyawan.alamat || 'N/A'}</TableHead>
                                    <TableHead>{karyawan.nomor_telepon}</TableHead>
                                    <TableHead>{karyawan.status}</TableHead>
                                    <TableHead>
                                        <KaryawanFormDialog purpose="edit" karyawan={karyawan} divisis={divisis} jabatans={jabatans}>
                                            <Button variant={'ghost'} size={'icon'}>
                                                <Edit />
                                            </Button>
                                        </KaryawanFormDialog>
                                        <DeleteKaryawanAlertDialog karyawan={karyawan}>
                                            <Button variant={'ghost'} size={'icon'}>
                                                <Trash />
                                            </Button>
                                        </DeleteKaryawanAlertDialog>
                                    </TableHead>
                                </TableRow>
                            ))}
                    </TableBody>
                </Table>
            </div>
        </AppLayout>
    );
};

export default KaryawanList;
