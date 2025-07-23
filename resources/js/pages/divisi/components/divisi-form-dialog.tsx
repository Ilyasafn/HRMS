import { Button } from '@/components/ui/button';
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Divisi } from '@/types';
import { useForm } from '@inertiajs/react';
import { FC, PropsWithChildren } from 'react';

type Props = PropsWithChildren & {
    divisi?: Divisi;
    purpose: 'tambah' | 'edit';
};

const DivisiFormDialog: FC<Props> = ({ children, divisi, purpose }) => {
    const { data, setData, post, put } = useForm({
        nama: divisi?.nama || '',
        keterangan: divisi?.keterangan || '',
    });

    const handleSubmit = () => {
        if (purpose === 'tambah') {
            post(route('divisi.store'));
        } else {
            put(route('divisi.update', divisi?.id));
        }
    };

    return (
        <Dialog>
            <DialogTrigger>{children}</DialogTrigger>
            <DialogContent>
                <DialogHeader>
                    <DialogTitle className="capitalize">{purpose} data Divisi</DialogTitle>
                    <DialogDescription>Dialog ini digunakan untuk {purpose} data Divisi.</DialogDescription>
                </DialogHeader>

                {/* <Input value={data.nama} onChange={(e) => setData('nama', e.target.value)} placeholder="Nama Divisi" /> */}

                <div className="mt-4 space-y-4">
                    <div className="flex flex-col gap-2">
                        <Label>Nama Divisi</Label>
                        <Input value={data.nama} onChange={(e) => setData('nama', e.target.value)} placeholder="Isi nama divisi.." />
                    </div>

                    <div className="flex flex-col gap-2">
                        <Label>Keterangan</Label>
                        <Input value={data.keterangan} onChange={(e) => setData('keterangan', e.target.value)} placeholder="Isi keterangan.." />
                    </div>
                </div>

                <div className="mt-6 flex justify-end gap-2">
                    <Button onClick={handleSubmit}>Simpan</Button>
                </div>
            </DialogContent>
        </Dialog>
    );
};

export default DivisiFormDialog;
