import { Avatar, AvatarImage } from '@/components/ui/avatar';
import { Button } from '@/components/ui/button';
import { Card, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { SharedData } from '@/types';
import { Link, usePage } from '@inertiajs/react';
import { Folder, Settings } from 'lucide-react';

const UserInfoWidget = () => {
  const {
    auth: { user },
  } = usePage<SharedData>().props;

  return (
    <Card>
      <div className="grid md:grid-cols-3 gap-4 p-1">
        <div className="col-span-2">
          <CardHeader className="flex flex-row items-center gap-2">
            <div>
              <Avatar className="size-10">
                <AvatarImage src={user.avatar} alt={user.name} />
              </Avatar>
            </div>
            <div>
              <CardTitle>{user.name}</CardTitle>
              <CardDescription>{user.email}</CardDescription>
            </div>
          </CardHeader>
        </div>
        <div className="content-center">
          <CardFooter className="order-last flex justify-end gap-2">
            <Button variant="outline" asChild>
              <Link href={route('profile.edit')}>
                <Settings />
                Edit profile
              </Link>
            </Button>
            <Button variant="outline" asChild>
              <Link href={route('user.show', user.id)}>
                <Folder />
                Detail anda
              </Link>
            </Button>
          </CardFooter>
        </div>
      </div>
    </Card>
  );
};

export default UserInfoWidget;
