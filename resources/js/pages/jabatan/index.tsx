import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Table, TableBody, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import AppLayout from '@/layouts/app-layout';
import { Jabatan } from '@/types';
import { Edit, Plus, Trash } from 'lucide-react';
import { useState } from 'react';
import DeleteJabatanAlertDialog from './components/delete-jabatan-alert-dialog';
import JabatanFormDialog from './components/jabatan-form-dialog';

const JabatanList = ({ jabatans }: { jabatans: Jabatan[] }) => {
    const [cari, setCari] = useState('');
    return (
        <AppLayout
            breadcrumbs={[
                {
                    title: 'Dashboard',
                    href: '/dashboard',
                },
                {
                    title: 'Jabatan',
                    href: route('jabatan.index'),
                },
            ]}
        >
            <div className="p-4">
                <div className="flex gap-4">
                    <Input value={cari} onChange={(e) => setCari(e.target.value)} placeholder="Cari jabatan..." />
                    <JabatanFormDialog purpose="tambah">
                        <Button>
                            <Plus /> Tambah Divisi
                        </Button>
                    </JabatanFormDialog>
                </div>
                <Table>
                    <TableHeader>
                        <TableRow>
                            <TableHead>No</TableHead>
                            <TableHead>Nama</TableHead>
                            <TableHead>Action</TableHead>
                        </TableRow>
                    </TableHeader>
                    <TableBody>
                        {jabatans
                            .filter((jabatans) => jabatans.nama.includes(cari))
                            .map((jabatan, index) => (
                                <TableRow key={jabatan.id}>
                                    <TableHead>{index + 1}</TableHead>
                                    <TableHead>{jabatan.nama}</TableHead>
                                    <TableHead>
                                        <JabatanFormDialog purpose="edit" jabatan={jabatan}>
                                            <Button variant={'ghost'} size={'icon'}>
                                                <Edit />
                                            </Button>
                                        </JabatanFormDialog>
                                        <DeleteJabatanAlertDialog jabatan={jabatan}>
                                            <Button variant={'ghost'} size={'icon'}>
                                                <Trash />
                                            </Button>
                                        </DeleteJabatanAlertDialog>
                                    </TableHead>
                                </TableRow>
                            ))}
                    </TableBody>
                </Table>
            </div>
        </AppLayout>
    );
};

export default JabatanList;
