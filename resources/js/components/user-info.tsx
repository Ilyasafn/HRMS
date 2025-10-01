import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { useInitials } from '@/hooks/use-initials';
import { User } from '@/types/user';

export function UserInfo({ user }: { user: User }) {
  const getInitials = useInitials();

  return (
    <>
      <Avatar className="h-8 w-8 overflow-hidden rounded-full">
        <AvatarImage src={user.avatar} />
        <AvatarFallback className="rounded-lg bg-neutral-200 text-black dark:bg-neutral-700 dark:text-white">{getInitials(user.name)}</AvatarFallback>
      </Avatar>
    </>
  );
}
