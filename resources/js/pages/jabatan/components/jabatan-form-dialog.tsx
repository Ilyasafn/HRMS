import { Button } from '@/components/ui/button';
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Jabatan } from '@/types';
import { useForm } from '@inertiajs/react';
import { FC, PropsWithChildren } from 'react';

type Props = PropsWithChildren & {
    jabatan?: Jabatan;
    purpose: 'tambah' | 'edit';
};

const JabatanFormDialog: FC<Props> = ({ children, jabatan, purpose }) => {
    const { data, setData, post, put } = useForm({
        nama: jabatan?.nama || '',
    });

    const handleSubmit = () => {
        if (purpose === 'tambah') {
            post(route('jabatan.store'));
        } else {
            put(route('jabatan.update', jabatan?.id));
        }
    };

    return (
        <Dialog>
            <DialogTrigger>{children}</DialogTrigger>
            <DialogContent>
                <DialogHeader>
                    <DialogTitle className="capitalize">{purpose} data Jabatan</DialogTitle>
                    <DialogDescription>Dialog ini digunakan untuk {purpose} data Jabatan.</DialogDescription>
                </DialogHeader>

                <div className="mt-4 space-y-4">
                    <div className="flex flex-col gap-2">
                        <Label>Nama Jabatan</Label>
                        <Input value={data.nama} onChange={(e) => setData('nama', e.target.value)} placeholder="Isi nama jabatan.." />
                    </div>
                </div>

                <div className="mt-6 flex justify-end gap-2">
                    <Button onClick={handleSubmit}>Simpan</Button>
                </div>
            </DialogContent>
        </Dialog>
    );
};

export default JabatanFormDialog;
