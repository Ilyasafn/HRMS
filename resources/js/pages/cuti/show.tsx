import { Card, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import AppLayout from '@/layouts/app-layout';
import { Cuti } from '@/types/cuti';
import { FC } from 'react';

type Props = {
  cuti: Cuti;
};

const ShowCuti: FC<Props> = ({ cuti }) => {
  return (
    <AppLayout title="Detail Cuti" description="Detail cuti">
      <Card>
        <CardHeader>
          <CardTitle>{ cuti.name }</CardTitle>
          <CardDescription>
            Lorem ipsum dolor sit amet consectetur adipisicing elit. Odio, quo impedit cupiditate voluptas culpa magnam itaque distinctio at ullam,
            beatae perferendis doloremque facilis mollitia, quod corporis. Autem voluptatum ipsum placeat.
          </CardDescription>
        </CardHeader>
      </Card>
    </AppLayout>
  );
};

export default ShowCuti;
