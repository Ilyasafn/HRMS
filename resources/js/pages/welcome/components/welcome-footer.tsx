import { SharedData } from '@/types';
import { usePage } from '@inertiajs/react';

const WelcomeFooter = () => {
  const { quote } = usePage<SharedData>().props;

  return (
    <div className="grid py-12">
      <div>
        <p className="text-muted-foreground">{quote.message}</p>
        <p>{quote.author}</p>
      </div>
    </div>
  );
};

export default WelcomeFooter;
