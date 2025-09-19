import { Check, Loader2, LucideIcon } from 'lucide-react';
import { FC } from 'react';
import { Button } from './ui/button';

type Props = {
  label?: string;
  icon?: LucideIcon | null;
  loading?: boolean;
  onClick?: () => void;
  disabled?: boolean;
};

const SubmitButton: FC<Props> = ({ label, icon: Icon, loading, ...props }) => {
  return (
    <Button type="submit" disabled={loading} {...props}>
      {loading ? <Loader2 className="animate-spin" /> : Icon ? <Icon /> : <Check />}
      {label ?? 'Submit'}
    </Button>
  );
};

export default SubmitButton;
