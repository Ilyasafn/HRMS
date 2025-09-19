import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Checkbox } from '@/components/ui/checkbox';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import AppLayout from '@/layouts/app-layout';
import { groupBy } from '@/lib/utils';
import { SharedData } from '@/types';
import { Permission } from '@/types/role';
import { Link, usePage } from '@inertiajs/react';
import { ArrowLeft, Edit, Filter, Folder, Plus, RefreshCcw, Trash2 } from 'lucide-react';
import { FC, useState } from 'react';
import PermissionBulkDeleteDialog from './components/permission-bulk-delete-dialog';
import PermissionBulkEditSheet from './components/permission-bulk-edit-sheet';
import PermissionDeleteDialog from './components/permission-delete-dialog';
import PermissionFilterSheet from './components/permission-filter-sheet';
import PermissionFormSheet from './components/permission-form-sheet';

type Props = {
  permits: Permission[];
  query: { [key: string]: string };
};

const PermissionList: FC<Props> = ({ permits, query }) => {
  const { permissions } = usePage<SharedData>().props;
  const [ids, setIds] = useState<number[]>([]);
  const [cari, setCari] = useState('');

  const permissionGroup = groupBy(permits, 'group');

  return (
    <AppLayout
      title="Permissions"
      description="Manage your permits"
      actions={
        <>
          <Button asChild variant={'secondary'}>
            <Link href={route('role.index')}>
              <ArrowLeft />
              Kembali ke list role
            </Link>
          </Button>
          {permissions?.canResync && (
            <Button variant={'secondary'} asChild>
              <Link method="post" href={route('permission.resync')}>
                <RefreshCcw /> Resycn permits
              </Link>
            </Button>
          )}
          {permissions?.canAdd && (
            <PermissionFormSheet purpose="create">
              <Button>
                <Plus />
                Create new permission
              </Button>
            </PermissionFormSheet>
          )}
        </>
      }
    >
      <div className="flex gap-2">
        <Input placeholder="Search permits..." value={cari} onChange={(e) => setCari(e.target.value)} />
        <PermissionFilterSheet query={query}>
          <Button>
            <Filter />
            Filter data
            {Object.values(query).filter((val) => val && val !== '').length > 0 && (
              <Badge variant="secondary">{Object.values(query).filter((val) => val && val !== '').length}</Badge>
            )}
          </Button>
        </PermissionFilterSheet>
        {ids.length > 0 && (
          <>
            <Button variant={'ghost'} disabled>
              {ids.length} item selected
            </Button>
            <PermissionBulkEditSheet permissionIds={ids}>
              <Button>
                <Edit /> Edit selected
              </Button>
            </PermissionBulkEditSheet>
            <PermissionBulkDeleteDialog permissionIds={ids}>
              <Button variant={'destructive'}>
                <Trash2 /> Delete selected
              </Button>
            </PermissionBulkDeleteDialog>
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
                    checked={ids.length === permits.length}
                    onCheckedChange={(checked) => {
                      if (checked) {
                        setIds(permits.map((permission) => permission.id));
                      } else {
                        setIds([]);
                      }
                    }}
                  />
                </Label>
              </Button>
            </TableHead>
            <TableHead>Group</TableHead>
            <TableHead>Permission Name</TableHead>
            <TableHead>Actions</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {Object.entries(permissionGroup)
            .filter((permission) => JSON.stringify(permission).toLowerCase().includes(cari.toLowerCase()))
            .map(([group, permits]) =>
              permits.map((permission) => (
                <TableRow key={permission.id}>
                  <TableCell>
                    <Button variant={'ghost'} size={'icon'} asChild>
                      <Label>
                        <Checkbox
                          checked={ids.includes(permission.id)}
                          onCheckedChange={(checked) => {
                            if (checked) {
                              setIds([...ids, permission.id]);
                            } else {
                              setIds(ids.filter((id) => id !== permission.id));
                            }
                          }}
                        />
                      </Label>
                    </Button>
                  </TableCell>
                  <TableCell>{group}</TableCell>
                  <TableCell>{permission.name}</TableCell>
                  <TableCell>
                    {permissions?.canAdd && (
                      <Button variant={'ghost'} size={'icon'}>
                        <Link href={route('permission.show', permission.id)}>
                          <Folder />
                        </Link>
                      </Button>
                    )}
                    {permissions?.canAdd && (
                      <PermissionFormSheet purpose="edit" permission={permission}>
                        <Button variant={'ghost'} size={'icon'}>
                          <Edit />
                        </Button>
                      </PermissionFormSheet>
                    )}
                    {permissions?.canAdd && (
                      <PermissionDeleteDialog permission={permission}>
                        <Button variant={'ghost'} size={'icon'}>
                          <Trash2 />
                        </Button>
                      </PermissionDeleteDialog>
                    )}
                  </TableCell>
                </TableRow>
              )),
            )}
        </TableBody>
      </Table>
    </AppLayout>
  );
};

export default PermissionList;
