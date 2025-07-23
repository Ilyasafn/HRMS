import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Table, TableBody, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import AppLayout from '@/layouts/app-layout';
import { Divisi } from '@/types';
import { Edit, Plus, Trash } from 'lucide-react';
import { useState } from 'react';
import DeleteDivisiAlertDialog from './components/delete-divisi-alert-dialog';
import DivisiFormDialog from './components/divisi-form-dialog';

const DivisiList = ({ divisis }: { divisis: Divisi[] }) => {
    const [cari, setCari] = useState('');
    return (
        <AppLayout
            breadcrumbs={[
                {
                    title: 'Dashboard',
                    href: '/dashboard',
                },
                {
                    title: 'Divisi',
                    href: route('divisi.index'),
                },
            ]}
        >
            <div className="p-4">
                <div className="flex gap-4">
                    <Input value={cari} onChange={(e) => setCari(e.target.value)} placeholder="Cari divisi..." />
                    <DivisiFormDialog purpose="tambah">
                        <Button>
                            <Plus /> Tambah Divisi
                        </Button>
                    </DivisiFormDialog>
                </div>
                <Table>
                    <TableHeader>
                        <TableRow>
                            <TableHead>No</TableHead>
                            <TableHead>Nama</TableHead>
                            <TableHead>Keterangan</TableHead>
                            <TableHead>Action</TableHead>
                        </TableRow>
                    </TableHeader>
                    <TableBody>
                        {divisis
                            .filter((divisi) => divisi.nama.includes(cari))
                            .map((divisi, index) => (
                                <TableRow key={divisi.id}>
                                    <TableHead>{index + 1}</TableHead>
                                    <TableHead>{divisi.nama}</TableHead>
                                    <TableHead>{divisi.keterangan}</TableHead>
                                    <TableHead>
                                        <DivisiFormDialog divisi={divisi} purpose="edit">
                                            <Button variant={'ghost'} size={'icon'}>
                                                <Edit />
                                            </Button>
                                        </DivisiFormDialog>
                                        <DeleteDivisiAlertDialog divisi={divisi}>
                                            <Button variant={'ghost'} size={'icon'}>
                                                <Trash />
                                            </Button>
                                        </DeleteDivisiAlertDialog>
                                    </TableHead>
                                </TableRow>
                            ))}
                    </TableBody>
                </Table>
            </div>
        </AppLayout>
    );
};

export default DivisiList;
