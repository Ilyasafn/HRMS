import { Card, CardHeader, CardTitle } from '@/components/ui/card';
import { Absensi } from '@/types/absensi';
import { FC } from 'react';

type Props = {
  absensi: Absensi;
  className?: string;
};

const AbsensiItemCard: FC<Props> = ({ absensi, className }) => {
  return (
    <Card className={className}>
      <CardHeader>
        <CardTitle>{absensi.name}</CardTitle>
        <CardDescription>ID: {absensi.id}</CardDescription>
      </CardHeader>
    </Card>
  );
};

export default AbsensiItemCard;
