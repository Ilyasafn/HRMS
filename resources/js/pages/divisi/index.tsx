import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Table, TableBody, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import AppLayout from '@/layouts/app-layout';
import { Divisi } from '@/types';
import { Edit, Plus, Trash } from 'lucide-react';
import { useState } from 'react';

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
                    <Button>
                        <Plus /> Tambah Divisi
                    </Button>
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
                                        <Button variant={'ghost'} size={'icon'}>
                                            <Edit />
                                        </Button>
                                        <Button variant={'ghost'} size={'icon'}>
                                            <Trash />
                                        </Button>
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
