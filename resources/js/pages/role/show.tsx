import HeadingSmall from '@/components/heading-small';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Checkbox } from '@/components/ui/checkbox';
import { Label } from '@/components/ui/label';
import AppLayout from '@/layouts/app-layout';
import { capitalizeWords, em, groupBy } from '@/lib/utils';
import { SharedData } from '@/types';
import { Permission, Role } from '@/types/role';
import { Link, useForm, usePage } from '@inertiajs/react';
import { ArrowLeft, Check, Edit, Plus, RefreshCcw } from 'lucide-react';
import { FC } from 'react';
import { toast } from 'sonner';
import PermissionFormSheet from '../permission/components/permission-form-sheet';
import RoleFormSheet from './components/role-form-sheet';

type Props = {
  role: Role;
  permits: Permission[];
};

const ShowRole: FC<Props> = ({ role, permits }) => {
  const { permissions } = usePage<SharedData>().props;

  const groupPermissions = groupBy(permits, 'group');

  const { data, setData, put } = useForm({
    permissions: (role.permissions ?? []).map((permission) => permission.name),
  });

  const handleSubmit = () => {
    put(route('role.update', role.id), {
      preserveScroll: true,
      onSuccess: () => {
        toast.success('Role updated successfully');
      },
      onError: (e) => toast.error(em(e)),
    });
  };

  return (
    <AppLayout
      title="Detail Role"
      description="Detail role"
      actions={
        <>
          <Link href={route('role.index')}>
            <Button variant={'secondary'}>
              <ArrowLeft />
              Back to route list
            </Button>
          </Link>
          <RoleFormSheet purpose="edit" role={role}>
            <Button>
              <Edit /> Edit nama role
            </Button>
          </RoleFormSheet>
          <Button onClick={handleSubmit}>
            <Check /> Simpan
          </Button>
        </>
      }
    >
      <Card>
        <CardHeader>
          <CardTitle>{capitalizeWords(role.name)}</CardTitle>
          <CardDescription>
            {(role.permissions ?? []).length ? role.permissions?.map((permission) => permission.name).join(', ') : 'Belum ada permission'}
          </CardDescription>
        </CardHeader>
      </Card>

      <HeadingSmall
        title="Permission"
        description="Pilih permission yang ingin digunakan unruk role ini"
        actions={
          <>
            {permissions?.canResyncPermission && (
              <Button variant={'secondary'} asChild>
                <Link method="post" href={route('permission.resync')}>
                  <RefreshCcw /> Resycn permissions
                </Link>
              </Button>
            )}
            {permissions?.canAddPermission && (
              <PermissionFormSheet purpose="create">
                <Button variant={'secondary'}>
                  <Plus /> Tambah permission
                </Button>
              </PermissionFormSheet>
            )}
          </>
        }
      />

      <div className="masonry">
        {Object.entries(groupPermissions).map(([group, permits]) => (
          <Card key={group} className="break-inside-avoid">
            <CardHeader>
              <CardTitle>{group.charAt(0).toUpperCase() + group.slice(1)}</CardTitle>
              <CardDescription>{permits.length} permits</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="grid">
                {permits.map((permission) => (
                  <Label key={permission.id} className="flex h-8 items-center gap-2">
                    <Checkbox
                      defaultChecked={data.permissions.includes(permission.name)}
                      onCheckedChange={(c) =>
                        setData('permissions', c ? [...data.permissions, permission.name] : data.permissions.filter((p) => p !== permission.name))
                      }
                    />
                    {permission.name}
                  </Label>
                ))}
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    </AppLayout>
  );
};

export default ShowRole;
