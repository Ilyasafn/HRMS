import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Checkbox } from '@/components/ui/checkbox';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import AppLayout from '@/layouts/app-layout';
import { SharedData } from '@/types';
import { Divisi } from '@/types/divisi';
import { Link, usePage } from '@inertiajs/react';
import { Edit, Filter, Folder, FolderArchive, Image, Plus, Trash2 } from 'lucide-react';
import { FC, useState } from 'react';
import DivisiDeleteDialog from './components/divisi-delete-dialog';
import DivisiFilterSheet from './components/divisi-filter-sheet';
import DivisiFormSheet from './components/divisi-form-sheet';
import DivisiBulkEditSheet from './components/divisi-bulk-edit-sheet';
import DivisiBulkDeleteDialog from './components/divisi-bulk-delete-dialog';
import DivisiUploadMediaSheet from './components/divisi-upload-sheet';

type Props = {
  divisis: Divisi[];
  query: { [key: string]: string };
};

const DivisiList: FC<Props> = ({ divisis, query }) => {
  const [ids, setIds] = useState<number[]>([]);
  const [cari, setCari] = useState('');

  const { permissions } = usePage<SharedData>().props;

  return (
    <AppLayout
      title="Divisis"
      description="Manage your divisis"
      actions={
        <>
          {permissions?.canAdd && (
            <DivisiFormSheet purpose="create">
              <Button>
                <Plus />
                Create new divisi
              </Button>
            </DivisiFormSheet>
          )}
          <Button variant={'destructive'} size={'icon'} asChild>
    <Link href={route('divisi.archived')}>
        <FolderArchive />
    </Link>
</Button>
        </>
      }
    >
      <div className="flex gap-2">
        <Input placeholder="Search divisis..." value={cari} onChange={(e) => setCari(e.target.value)} />
        <DivisiFilterSheet query={query}>
          <Button>
            <Filter />
            Filter data
            {Object.values(query).filter((val) => val && val !== '').length > 0 && (
              <Badge variant="secondary">{Object.values(query).filter((val) => val && val !== '').length}</Badge>
            )}
          </Button>
        </DivisiFilterSheet>
        {ids.length > 0 && (
          <>
            <Button variant={'ghost'} disabled>
              {ids.length} item selected
            </Button>
            <DivisiBulkEditSheet divisiIds={ids}>
              <Button>
                <Edit /> Edit selected
              </Button>
            </DivisiBulkEditSheet>
            <DivisiBulkDeleteDialog divisiIds={ids}>
              <Button variant={'destructive'}>
                <Trash2 /> Delete selected
              </Button>
            </DivisiBulkDeleteDialog>
          </>
        )}
      </div>
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>
              <Button variant={'ghost'} size={'icon'} asChild>
                <Label>
                  <Checkbox
                    checked={ids.length === divisis.length}
                    onCheckedChange={(checked) => {
                      if (checked) {
                        setIds(divisis.map((divisi) => divisi.id));
                      } else {
                        setIds([]);
                      }
                    }}
                  />
                </Label>
              </Button>
            </TableHead>
            <TableHead>Name</TableHead>
            <TableHead>Actions</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {divisis
            .filter((divisi) => JSON.stringify(divisi).toLowerCase().includes(cari.toLowerCase()))
            .map((divisi) => (
              <TableRow key={divisi.id}>
                <TableCell>
                  <Button variant={'ghost'} size={'icon'} asChild>
                    <Label>
                      <Checkbox
                        checked={ids.includes(divisi.id)}
                        onCheckedChange={(checked) => {
                          if (checked) {
                            setIds([...ids, divisi.id]);
                          } else {
                            setIds(ids.filter((id) => id !== divisi.id));
                          }
                        }}
                      />
                    </Label>
                  </Button>
                </TableCell>
                <TableCell>{ divisi.name }</TableCell>
                <TableCell>
                  {permissions?.canShow && (
                    <Button variant={'ghost'} size={'icon'}>
                      <Link href={route('divisi.show', divisi.id)}>
                        <Folder />
                      </Link>
                    </Button>
                  )}
                  {permissions?.canUpdate && (
                    <>
                      
                      <DivisiFormSheet purpose="edit" divisi={divisi}>
                        <Button variant={'ghost'} size={'icon'}>
                          <Edit />
                        </Button>
                      </DivisiFormSheet>
                    </>
                  )}
                  {permissions?.canDelete && (
                    <DivisiDeleteDialog divisi={divisi}>
                      <Button variant={'ghost'} size={'icon'}>
                        <Trash2 />
                      </Button>
                    </DivisiDeleteDialog>
                  )}
                </TableCell>
              </TableRow>
            ))}
        </TableBody>
      </Table>
    </AppLayout>
  );
};

export default DivisiList;
