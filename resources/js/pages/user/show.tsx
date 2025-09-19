import { Card, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import AppLayout from '@/layouts/app-layout';
import { User } from '@/types/user';
import { FC } from 'react';

type Props = {
  user: User;
};

const ShowUser: FC<Props> = ({ user }) => {
  return (
    <AppLayout title="Detail User" description="Detail user">
      <Card>
        <CardHeader>
          <CardTitle>{user.name}</CardTitle>
          <CardDescription>{user.email}</CardDescription>
        </CardHeader>
      </Card>
    </AppLayout>
  );
};

export default ShowUser;
