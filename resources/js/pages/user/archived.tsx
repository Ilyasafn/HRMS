import { Button } from '@/components/ui/button';
import { Checkbox } from '@/components/ui/checkbox';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import AppLayout from '@/layouts/app-layout';
import { em } from '@/lib/utils';
import { User } from '@/types/user';
import { Link, router } from '@inertiajs/react';
import { ArrowLeft, Trash2, Undo2 } from 'lucide-react';
import { FC, useState } from 'react';
import { toast } from 'sonner';

type Props = {
  users: User[];
};

const ArchivedUserList: FC<Props> = ({ users }) => {
  const [ids, setIds] = useState<number[]>([]);
  const [cari, setCari] = useState('');

  const handleRestore = (id: User['id']) => {
    router.put(
      route('user.restore', id),
      {},
      {
        preserveScroll: true,
        onSuccess: () => toast.success('Data berhasil di restore!'),
        onError: (e) => toast.error(em(e)),
      },
    );
  };

  const handleForceDelete = (id: User['id']) => {
    router.delete(route('user.force-delete', id), {
      preserveScroll: true,
      onSuccess: () => toast.success('Data berhasil di hapus permanen!'),
      onError: (e) => toast.error(em(e)),
    });
  };

  return (
    <AppLayout
      title="Users"
      description="Manage your users"
      actions={
        <Button variant={'secondary'} asChild>
          <Link href={route('user.index')}>
            <ArrowLeft />
            Kembali ke list
          </Link>
        </Button>
      }
    >
      <div className="flex gap-2">
        <Input placeholder="Search users..." value={cari} onChange={(e) => setCari(e.target.value)} />
        {ids.length > 0 && (
          <>
            <Button variant={'ghost'} disabled>
              {ids.length} item selected
            </Button>
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
                    checked={ids.length === users.length}
                    onCheckedChange={(checked) => {
                      if (checked) {
                        setIds(users.map((user) => user.id));
                      } else {
                        setIds([]);
                      }
                    }}
                  />
                </Label>
              </Button>
            </TableHead>
            <TableHead>Name</TableHead>
            <TableHead>Email</TableHead>
            <TableHead>Role names</TableHead>
            <TableHead>Actions</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {users
            .filter((user) => JSON.stringify(user).toLowerCase().includes(cari.toLowerCase()))
            .map((user) => (
              <TableRow key={user.id}>
                <TableCell>
                  <Button variant={'ghost'} size={'icon'} asChild>
                    <Label>
                      <Checkbox
                        checked={ids.includes(user.id)}
                        onCheckedChange={(checked) => {
                          if (checked) {
                            setIds([...ids, user.id]);
                          } else {
                            setIds(ids.filter((id) => id !== user.id));
                          }
                        }}
                      />
                    </Label>
                  </Button>
                </TableCell>
                <TableCell>{user.name}</TableCell>
                <TableCell>{user.email}</TableCell>
                <TableCell>{user.roles?.join(', ')}</TableCell>
                <TableCell>
                  <Button variant={'ghost'} size={'icon'} onClick={() => handleRestore(user.id)}>
                    <Undo2 />
                  </Button>
                  <Button variant={'ghost'} size={'icon'} onClick={() => handleForceDelete(user.id)}>
                    <Trash2 />
                  </Button>
                </TableCell>
              </TableRow>
            ))}
        </TableBody>
      </Table>
    </AppLayout>
  );
};

export default ArchivedUserList;
