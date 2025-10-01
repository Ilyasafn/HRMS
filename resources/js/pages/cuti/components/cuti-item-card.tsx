import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { FC } from 'react';
import { Cuti } from '@/types/cuti';

type Props = {
  cuti: Cuti;
  className?: string;
};

const CutiItemCard: FC<Props> = ({ cuti, className }) => {
  return (
    <Card className={className}>
      <CardHeader>
        <CardTitle>{ cuti.name }</CardTitle>
        <CardDescription>
            ID: { cuti.id }
        </CardDescription>
      </CardHeader>
    </Card>
  );
};

export default CutiItemCard;
