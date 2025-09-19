import { Avatar, AvatarImage } from '@/components/ui/avatar';
import { Button } from '@/components/ui/button';
import { Card, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { SharedData } from '@/types';
import { Link, usePage } from '@inertiajs/react';
import { Settings } from 'lucide-react';

const UserInfoWidget = () => {
  const {
    auth: { user },
  } = usePage<SharedData>().props;

  return (
    <Card>
      <div className="flex justify-between">
        <CardHeader>
          <Avatar className="size-10">
            <AvatarImage src={user.avatar} alt={user.name} />
          </Avatar>
        </CardHeader>
        <CardHeader className="flex-1 pl-0">
          <CardTitle>{user.name}</CardTitle>
          <CardDescription>{user.email}</CardDescription>
        </CardHeader>
        <CardFooter>
          <Button variant="outline" asChild>
            <Link href={route('profile.edit')}>
              <Settings />
              Edit profile
            </Link>
          </Button>
        </CardFooter>
      </div>
    </Card>
  );
};

export default UserInfoWidget;
