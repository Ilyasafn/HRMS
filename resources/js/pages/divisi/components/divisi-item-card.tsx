import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { FC } from 'react';
import { Divisi } from '@/types/divisi';

type Props = {
  divisi: Divisi;
  className?: string;
};

const DivisiItemCard: FC<Props> = ({ divisi, className }) => {
  return (
    <Card className={className}>
      <CardHeader>
        <CardTitle>{ divisi.name }</CardTitle>
        <CardDescription>
            ID: { divisi.id }
        </CardDescription>
      </CardHeader>
    </Card>
  );
};

export default DivisiItemCard;
