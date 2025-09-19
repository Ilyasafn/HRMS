import { Card, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import AppLayout from '@/layouts/app-layout';
import { Divisi } from '@/types/divisi';
import { FC } from 'react';

type Props = {
  divisi: Divisi;
};

const ShowDivisi: FC<Props> = ({ divisi }) => {
  return (
    <AppLayout title="Detail Divisi" description="Detail divisi">
      <Card>
        <CardHeader>
          <CardTitle>{ divisi.name }</CardTitle>
          <CardDescription>
            Lorem ipsum dolor sit amet consectetur adipisicing elit. Odio, quo impedit cupiditate voluptas culpa magnam itaque distinctio at ullam,
            beatae perferendis doloremque facilis mollitia, quod corporis. Autem voluptatum ipsum placeat.
          </CardDescription>
        </CardHeader>
      </Card>
    </AppLayout>
  );
};

export default ShowDivisi;
