import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { FC } from 'react';
import { Payroll } from '@/types/payroll';

type Props = {
  payroll: Payroll;
  className?: string;
};

const PayrollItemCard: FC<Props> = ({ payroll, className }) => {
  return (
    <Card className={className}>
      <CardHeader>
        <CardTitle>{ payroll.name }</CardTitle>
        <CardDescription>
            ID: { payroll.id }
        </CardDescription>
      </CardHeader>
    </Card>
  );
};

export default PayrollItemCard;
