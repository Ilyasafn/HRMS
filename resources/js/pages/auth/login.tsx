import FormControl from '@/components/form-control';
import TextLink from '@/components/text-link';
import { Button } from '@/components/ui/button';
import { Checkbox } from '@/components/ui/checkbox';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import AuthLayout from '@/layouts/auth-layout';
import { Head, useForm } from '@inertiajs/react';
import { LoaderCircle } from 'lucide-react';

interface LoginProps {
  status?: string;
  canResetPassword: boolean;
}

export default function Login({ status, canResetPassword }: LoginProps) {
  const { data, setData, post, processing } = useForm({
    email: 'admin@gmail.com',
    password: 'password',
    remember: false,
  });

  const submit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    post(route('login'));
  };

  return (
    <AuthLayout title="Log in to your account" description="Enter your email and password below to log in">
      <Head title="Log in" />

      <form className="flex flex-col gap-6" onSubmit={submit}>
        <>
          <div className="grid gap-6">
            <FormControl label="Email">
              <Input type="email" value={data.email} required placeholder="email@example.com" onChange={(e) => setData('email', e.target.value)} />
            </FormControl>
            <FormControl
              label="Password"
              action={
                <>
                  {canResetPassword && (
                    <TextLink href={route('password.request')} className="ml-auto text-sm" tabIndex={5}>
                      Forgot password?
                    </TextLink>
                  )}
                </>
              }
            >
              <Input type="password" required placeholder="Password" value={data.password} onChange={(e) => setData('password', e.target.value)} />
            </FormControl>

            <div className="flex items-center space-x-3">
              <Checkbox id="remember" name="remember" tabIndex={3} />
              <Label htmlFor="remember">Remember me</Label>
            </div>

            <Button type="submit" className="mt-4 w-full" tabIndex={4} disabled={processing}>
              {processing && <LoaderCircle className="h-4 w-4 animate-spin" />}
              Log in
            </Button>
          </div>

          <div className="text-center text-sm text-muted-foreground">
            Don't have an account?{' '}
            <TextLink href={route('register')} tabIndex={5}>
              Sign up
            </TextLink>
          </div>
        </>
      </form>

      {status && <div className="mb-4 text-center text-sm font-medium text-green-600">{status}</div>}
    </AuthLayout>
  );
}
