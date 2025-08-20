import {
    AlertDialog,
    AlertDialogAction,
    AlertDialogCancel,
    AlertDialogContent,
    AlertDialogDescription,
    AlertDialogFooter,
    AlertDialogHeader,
    AlertDialogTitle,
    AlertDialogTrigger,
} from '@/components/ui/alert-dialog';
import { User } from '@/types';
import { router } from '@inertiajs/react';
import { FC, PropsWithChildren } from 'react';

type Props = PropsWithChildren & {
    karyawan?: User;
};

const DeleteKaryawanAlertDialog: FC<Props> = ({ children, karyawan }) => {
    const handleDelete = () => {
        if (!karyawan?.id) return;
        router.delete(route('karyawan.destroy', karyawan.id));
    };

    return (
        <AlertDialog>
            <AlertDialogTrigger>{children}</AlertDialogTrigger>
            <AlertDialogContent>
                <AlertDialogHeader>
                    <AlertDialogTitle>Apakah anda yakin ingin menghapus data ini?</AlertDialogTitle>
                    <AlertDialogDescription>
                        Tindakan ini tidak dapat dibatalkan. Ini akan menghapus data Anda secara permanen.
                    </AlertDialogDescription>
                </AlertDialogHeader>
                <AlertDialogFooter>
                    <AlertDialogCancel>Batal</AlertDialogCancel>
                    <AlertDialogAction onClick={handleDelete}>Hapus</AlertDialogAction>
                </AlertDialogFooter>
            </AlertDialogContent>
        </AlertDialog>
    );
};

export default DeleteKaryawanAlertDialog;
