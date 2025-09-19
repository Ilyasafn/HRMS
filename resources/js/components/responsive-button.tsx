import { useIsMobile } from '@/hooks/use-mobile';
import { LucideIcon } from 'lucide-react';
import { ComponentProps, FC } from 'react';
import { Button } from './ui/button';

type Props = ComponentProps<typeof Button> & {
  icon?: LucideIcon;
};

const ResponsiveButton: FC<Props> = ({ icon: Icon, ...props }) => {
  const isMobile = useIsMobile();
  return (
    <Button size={isMobile ? 'icon' : props.size} {...props}>
      {Icon && <Icon />}
      {!isMobile && props.children}
    </Button>
  );
};

export default ResponsiveButton;
