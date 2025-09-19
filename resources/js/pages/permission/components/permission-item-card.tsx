import { Button } from '@/components/ui/button';
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Permission } from '@/types/permission';
import { Link } from '@inertiajs/react';
import { Edit, Folder, Trash2 } from 'lucide-react';
import { FC } from 'react';
import PermissionDeleteDialog from './permission-delete-dialog';
import PermissionFormSheet from './permission-form-sheet';

type Props = {
  permission: Permission;
};

const PermissionItemCard: FC<Props> = ({ permission }) => {
  return (
    <Card className="flex flex-col justify-between">
      <CardHeader>
        <CardTitle>{permission.name}</CardTitle>
      </CardHeader>
      <CardContent>
        <p className="text-sm text-muted-foreground">ID: {permission.id}</p>
      </CardContent>
      <CardFooter className="flex gap-2">
        <Button variant="ghost" size="icon" asChild>
          <Link href={route('permission.show', permission.id)}>
            <Folder />
          </Link>
        </Button>
        <PermissionFormSheet purpose="edit" permission={permission}>
          <Button variant="ghost" size="icon">
            <Edit />
          </Button>
        </PermissionFormSheet>
        <PermissionDeleteDialog permission={permission}>
          <Button variant="ghost" size="icon">
            <Trash2 />
          </Button>
        </PermissionDeleteDialog>
      </CardFooter>
    </Card>
  );
};

export default PermissionItemCard;
