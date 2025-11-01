import { Card, CardHeader, CardTitle } from '@/components/ui/card';
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
        </CardHeader>
      </Card>
    </AppLayout>
  );
};

export default ShowPermission;
