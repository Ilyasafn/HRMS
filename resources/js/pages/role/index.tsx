import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Checkbox } from '@/components/ui/checkbox';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import AppLayout from '@/layouts/app-layout';
import { Role } from '@/types/role';
import { Link } from '@inertiajs/react';
import { Edit, Filter, Folder, List, Plus, Trash2 } from 'lucide-react';
import { FC, useState } from 'react';
import RoleDeleteDialog from './components/role-delete-dialog';
import RoleFilterSheet from './components/role-filter-sheet';
import RoleFormSheet from './components/role-form-sheet';

type Props = {
  roles: Role[];
  query: { [key: string]: string };
};

const RoleList: FC<Props> = ({ roles, query }) => {
  const [ids, setIds] = useState<number[]>([]);
  const [cari, setCari] = useState('');

  return (
    <AppLayout
      title="Roles"
      description="Manage your roles"
      actions={
        <>
          <RoleFormSheet purpose="create">
            <Button>
              <Plus />
              Create new role
            </Button>
          </RoleFormSheet>
          <Button asChild>
            <Link href={route('permission.index')}>
              <List />
              Lihat permission
            </Link>
          </Button>
        </>
      }
    >
      <div className="flex gap-2">
        <Input placeholder="Search roles..." value={cari} onChange={(e) => setCari(e.target.value)} />
        <RoleFilterSheet>
          <Button>
            <Filter />
            Filter data
            {Object.values(query).filter((val) => val && val !== '').length > 0 && (
              <Badge variant="secondary">{Object.values(query).filter((val) => val && val !== '').length}</Badge>
            )}
          </Button>
        </RoleFilterSheet>
        {ids.length > 0 && (
          <>
            <Button variant={'ghost'} disabled>
              {ids.length} item selected
            </Button>
            <Button>
              <Edit /> Edit selected
            </Button>
            <Button variant={'destructive'}>
              <Trash2 /> Delete selected
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
                    checked={ids.length === roles.length}
                    onCheckedChange={(checked) => {
                      if (checked) {
                        setIds(roles.map((role) => role.id));
                      } else {
                        setIds([]);
                      }
                    }}
                  />
                </Label>
              </Button>
            </TableHead>
            <TableHead>Name</TableHead>
            <TableHead>Permissions</TableHead>
            <TableHead>Actions</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {roles
            .filter((role) => JSON.stringify(role).toLowerCase().includes(cari.toLowerCase()))
            .map((role) => (
              <TableRow key={role.id}>
                <TableCell>
                  <Button variant={'ghost'} size={'icon'} asChild>
                    <Label>
                      <Checkbox
                        checked={ids.includes(role.id)}
                        onCheckedChange={(checked) => {
                          if (checked) {
                            setIds([...ids, role.id]);
                          } else {
                            setIds(ids.filter((id) => id !== role.id));
                          }
                        }}
                      />
                    </Label>
                  </Button>
                </TableCell>
                <TableCell>{role.name}</TableCell>
                <TableCell>{role.permissions?.length} permissions</TableCell>
                <TableCell>
                  <Button variant={'ghost'} size={'icon'}>
                    <Link href={route('role.show', role.id)}>
                      <Folder />
                    </Link>
                  </Button>
                  <RoleFormSheet purpose="edit" role={role}>
                    <Button variant={'ghost'} size={'icon'}>
                      <Edit />
                    </Button>
                  </RoleFormSheet>
                  <RoleDeleteDialog role={role}>
                    <Button variant={'ghost'} size={'icon'}>
                      <Trash2 />
                    </Button>
                  </RoleDeleteDialog>
                </TableCell>
              </TableRow>
            ))}
        </TableBody>
      </Table>
    </AppLayout>
  );
};

export default RoleList;
