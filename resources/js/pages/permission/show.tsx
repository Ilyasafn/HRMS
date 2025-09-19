import { Card, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import AppLayout from '@/layouts/app-layout';
import { Permission } from '@/types/permission';
import { FC } from 'react';

type Props = {
  permission: Permission;
};

const ShowPermission: FC<Props> = ({ permission }) => {
  return (
    <AppLayout title="Detail Permission" description="Detail permission">
      <Card>
        <CardHeader>
          <CardTitle>{permission.name}</CardTitle>
          <CardDescription>
            Lorem ipsum dolor sit amet consectetur adipisicing elit. Odio, quo impedit cupiditate voluptas culpa magnam itaque distinctio at ullam,
            beatae perferendis doloremque facilis mollitia, quod corporis. Autem voluptatum ipsum placeat.
          </CardDescription>
        </CardHeader>
      </Card>
    </AppLayout>
  );
};

export default ShowPermission;
