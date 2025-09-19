import { CalendarIcon } from 'lucide-react';

import { Button } from '@/components/ui/button';
import { Calendar } from '@/components/ui/calendar';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import { FC, useState } from 'react';

type Props = {
  value?: Date;
  onValueChange?: (value?: Date) => void;
};

const DatePicker: FC<Props> = ({ value, onValueChange }) => {
  const [open, setOpen] = useState(false);
  return (
    <Popover open={open} onOpenChange={setOpen}>
      <PopoverTrigger asChild>
        <Button variant="outline" className="w-full justify-between font-normal">
          {value ? value.toLocaleDateString() : 'Select value'}
          <CalendarIcon />
        </Button>
      </PopoverTrigger>
      <PopoverContent className="w-auto overflow-hidden p-0" align="start">
        <Calendar
          mode="single"
          selected={value}
          captionLayout="dropdown"
          onSelect={(value) => {
            onValueChange?.(value);
            setOpen(false);
          }}
        />
      </PopoverContent>
    </Popover>
  );
};

export default DatePicker;
