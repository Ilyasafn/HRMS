import { Button } from '@/components/ui/button';
import { Calendar } from '@/components/ui/calendar';
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Divisi, Jabatan, Karyawan } from '@/types';
import { useForm } from '@inertiajs/react';
import { ChevronDownIcon } from 'lucide-react';
import React, { FC, PropsWithChildren, useState } from 'react';

type Props = PropsWithChildren & {
    karyawan?: Karyawan;
    divisis: Divisi[];
    jabatans: Jabatan[];
    purpose: 'tambah' | 'edit';
};

const KaryawanFormDialog: FC<Props> = ({ children, karyawan, divisis, jabatans, purpose }) => {
    React.useEffect(() => {
        if (karyawan?.tgl_masuk) {
            setDate(new Date(karyawan.tgl_masuk));
        }
    }, [karyawan]);

    const [open, setOpen] = useState(false);
    const [date, setDate] = useState<Date | undefined>(undefined);

    const { data, setData, post, put } = useForm({
        nama: karyawan?.nama ?? '',
        nik: karyawan?.nik ?? '',
        divisi_id: karyawan?.divisi.id ?? '',
        jabatan_id: karyawan?.jabatan.id ?? '',
        alamat: karyawan?.alamat ?? '',
        nomor_telepon: karyawan?.nomor_telepon ?? '',
        tgl_masuk: karyawan?.tgl_masuk ?? '',
        status: karyawan?.status ?? 'Aktif',
    });

    const handleSubmit = (e?: React.FormEvent) => {
        e?.preventDefault();

        if (purpose === 'tambah') {
            post(route('karyawan.store'), {
                onSuccess: () => {
                    console.log('Success nambah cuyy!');
                    // setOpen(false);
                },
                onError: (errors) => {
                    console.log('Error dari server:', errors);
                },
            });
        } else {
            put(route('karyawan.update', karyawan?.id), {
                onSuccess: () => {
                    console.log('Success ngedit cuyy!');
                    // setOpen(false);
                },
                onError: (errors) => {
                    console.log('Error dari server:', errors);
                },
            });
        }
    };

    return (
        <Dialog>
            <DialogTrigger>{children}</DialogTrigger>
            <DialogContent>
                <DialogHeader>
                    <DialogTitle className="capitalize">{purpose} data Karyawan</DialogTitle>
                    <DialogDescription>Dialog ini digunakan untuk {purpose} data Karyawan.</DialogDescription>
                </DialogHeader>

                <div className="mt-4 space-y-4">
                    <div className="flex flex-col gap-2">
                        <Label>Nama Karyawan</Label>
                        <Input value={data.nama} onChange={(e) => setData('nama', e.target.value)} placeholder="Nama Karyawan" />
                    </div>

                    <div className="flex flex-col gap-2">
                        <Label>NIK Karyawan</Label>
                        <Input value={data.nik} onChange={(e) => setData('nik', e.target.value)} placeholder="NIK Karyawan" />
                    </div>

                    <div className="flex flex-row items-center gap-2">
                        <Label>Divisi</Label>
                        <Select value={data.divisi_id.toString()} onValueChange={(value) => setData('divisi_id', value)}>
                            <SelectTrigger>
                                <SelectValue placeholder="Pilih Divisi" />
                            </SelectTrigger>
                            <SelectContent>
                                {divisis.map((divisi) => (
                                    <SelectItem key={divisi.id} value={divisi.id.toString()}>
                                        {divisi.nama}
                                    </SelectItem>
                                ))}
                            </SelectContent>
                        </Select>

                        <Label>Jabatan</Label>
                        <Select value={data.jabatan_id.toString()} onValueChange={(value) => setData('jabatan_id', value)}>
                            <SelectTrigger>
                                <SelectValue placeholder="Pilih Jabatan" />
                            </SelectTrigger>
                            <SelectContent>
                                {jabatans.map((jabatan) => (
                                    <SelectItem key={jabatan.id} value={jabatan.id.toString()}>
                                        {jabatan.nama}
                                    </SelectItem>
                                ))}
                            </SelectContent>
                        </Select>
                    </div>

                    <div className="flex flex-col gap-2">
                        <Label>Alamat</Label>
                        <Input value={data.alamat} onChange={(e) => setData('alamat', e.target.value)} placeholder="Alamat" />
                    </div>

                    <div className="flex flex-col gap-2">
                        <Label>Nomor Telepon</Label>
                        <Input value={data.nomor_telepon} onChange={(e) => setData('nomor_telepon', e.target.value)} placeholder="Nomor Telepon" />
                    </div>

                    <div className="flex flex-row items-center gap-2">
                        <Label>Tanggal Masuk</Label>
                        <Popover open={open} onOpenChange={setOpen}>
                            <PopoverTrigger asChild>
                                <Button variant="outline" id="date" className="w-48 justify-between font-normal">
                                    {date ? date.toLocaleDateString() : 'Select date'}
                                    <ChevronDownIcon />
                                </Button>
                            </PopoverTrigger>
                            <PopoverContent className="w-auto overflow-hidden p-0" align="start">
                                <Calendar
                                    mode="single"
                                    selected={date}
                                    captionLayout="dropdown"
                                    onSelect={(date) => {
                                        setDate(date);
                                        setOpen(false);
                                        if (date) {
                                            const formatted = date.toISOString().split('T')[0];
                                            setData('tgl_masuk', formatted);
                                        }
                                    }}
                                />
                            </PopoverContent>
                        </Popover>

                        <Label>Status</Label>
                        <Select value={data.status.toString()} onValueChange={(value) => setData('status', value)}>
                            <SelectTrigger>
                                <SelectValue placeholder="Pilih Status" />
                            </SelectTrigger>
                            <SelectContent>
                                <SelectItem value="Aktif">Aktif</SelectItem>
                                <SelectItem value="Tidak Aktif">Tidak Aktif</SelectItem>
                            </SelectContent>
                        </Select>
                    </div>
                </div>

                <div className="mt-6 flex justify-end gap-2">
                    <Button
                        onClick={() => {
                            console.log('berhasil submit');
                            handleSubmit();
                            setOpen(false);
                        }}
                    >
                        Simpan
                    </Button>
                </div>
            </DialogContent>
        </Dialog>
    );
};

export default KaryawanFormDialog;
