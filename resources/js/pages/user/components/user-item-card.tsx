import { Button } from '@/components/ui/button';
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { User } from '@/types/user';
import { Link } from '@inertiajs/react';
import { Edit, Folder, Trash2 } from 'lucide-react';
import { FC } from 'react';
import UserDeleteDialog from './user-delete-dialog';
import UserFormSheet from './user-form-sheet';

type Props = {
  user: User;
};

const UserItemCard: FC<Props> = ({ user }) => {
  return (
    <Card className="flex flex-col justify-between">
      <CardHeader>
        <CardTitle>{user.name}</CardTitle>
      </CardHeader>
      <CardContent>
        <p className="text-sm text-muted-foreground">ID: {user.id}</p>
      </CardContent>
      <CardFooter className="flex gap-2">
        <Button variant="ghost" size="icon" asChild>
          <Link href={route('user.show', user.id)}>
            <Folder />
          </Link>
        </Button>
        <UserFormSheet purpose="edit" user={user}>
          <Button variant="ghost" size="icon">
            <Edit />
          </Button>
        </UserFormSheet>
        <UserDeleteDialog user={user}>
          <Button variant="ghost" size="icon">
            <Trash2 />
          </Button>
        </UserDeleteDialog>
      </CardFooter>
    </Card>
  );
};

export default UserItemCard;
