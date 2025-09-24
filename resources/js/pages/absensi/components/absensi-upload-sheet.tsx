import FormControl from '@/components/form-control';
import SubmitButton from '@/components/submit-button';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Sheet, SheetClose, SheetContent, SheetDescription, SheetFooter, SheetHeader, SheetTitle, SheetTrigger } from '@/components/ui/sheet';
import { em } from '@/lib/utils';
import { Absensi } from '@/types/absensi';
import { useForm } from '@inertiajs/react';
import { X } from 'lucide-react';
import { FC, PropsWithChildren, useState } from 'react';
import { toast } from 'sonner';

type Props = PropsWithChildren & {
  absensi: Absensi;
};

const AbsensiUploadMediaSheet: FC<Props> = ({ absensi, children }) => {
  const [open, setOpen] = useState(false);

  const { data, setData, post, processing } = useForm({
    file: undefined as File | undefined,
  });

  const handleUploadMedia = () => {
    post(route('absensi.upload-media', absensi.id), {
      preserveScroll: true,
      onSuccess: () => {
        toast.success('Media uploaded successfully');
        setData('file', undefined);
        setOpen(false);
      },
      onError: (e) => toast.error(em(e)),
    });
  };

  return (
    <Sheet open={open} onOpenChange={setOpen}>
      <SheetTrigger asChild>{children}</SheetTrigger>
      <SheetContent>
        <SheetHeader>
          <SheetTitle>Upload Media</SheetTitle>
          <SheetDescription>Upload media to absensi</SheetDescription>
        </SheetHeader>
        <ScrollArea className="flex-1 overflow-y-auto">
          <form
            className="space-y-6 px-4"
            onSubmit={(e) => {
              e.preventDefault();
              handleUploadMedia();
            }}
          >
            <FormControl label="Pilih file">
              <Input type="file" onChange={(e) => setData('file', e.target.files?.[0])} accept="image/*" />
              {data.file && <img src={URL.createObjectURL(data.file)} />}
            </FormControl>

            <div className="grid grid-cols-3 gap-1">
              {absensi.media?.map((media) => (
                <img key={media.id} src={media.preview_url} alt={media.name} className="aspect-square w-full object-cover" />
              ))}
            </div>

          </form>
        </ScrollArea>
        <SheetFooter>
          <SubmitButton onClick={handleUploadMedia} label={'Upload media'} loading={processing} disabled={processing} />
          <SheetClose asChild>
            <Button variant={'outline'}>
              <X /> Batalin
            </Button>
          </SheetClose>
        </SheetFooter>
      </SheetContent>
    </Sheet>
  );
};

export default AbsensiUploadMediaSheet;
