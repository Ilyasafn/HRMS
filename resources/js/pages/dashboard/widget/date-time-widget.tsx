import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import dayjs from 'dayjs';
import { Calendar } from 'lucide-react';
import { useEffect, useState } from 'react';

const DateTimeWidget = () => {
  const [now, setNow] = useState<string>(dayjs().format('DD MMMM YYYY | HH:mm:ss'));

  useEffect(() => {
    const interval = setInterval(() => {
      setNow(dayjs().format('DD MMMM YYYY | HH:mm:ss'));
    }, 1000);

    // cleanup pas component unmount
    return () => clearInterval(interval);
  }, []);

  return (
    <Card>
      <CardContent className="flex flex-1 items-center justify-center font-mono">
        <Button variant={'ghost'} disabled>
          <Calendar />
          {now}
        </Button>
      </CardContent>
    </Card>
  );
};

export default DateTimeWidget;
