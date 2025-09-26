import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { FC } from 'react';
import { Absensi } from '@/types/absensi';

type Props = {
  absensi: Absensi;
  className?: string;
};

const AbsensiItemCard: FC<Props> = ({ absensi, className }) => {
  return (
    <Card className={className}>
      <CardHeader>
        <CardTitle>{ absensi.name }</CardTitle>
        <CardDescription>
            ID: { absensi.id }
        </CardDescription>
      </CardHeader>
    </Card>
  );
};

export default AbsensiItemCard;
