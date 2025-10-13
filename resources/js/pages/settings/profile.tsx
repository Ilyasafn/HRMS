import { type BreadcrumbItem, type SharedData } from '@/types';
import { Transition } from '@headlessui/react';
import { Form, Link, usePage } from '@inertiajs/react';

import DeleteUser from '@/components/delete-user';
import HeadingSmall from '@/components/heading-small';
import InputError from '@/components/input-error';
import { Button } from '@/components/ui/button';
import { Calendar } from '@/components/ui/calendar';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Textarea } from '@/components/ui/textarea';
import SettingsLayout from '@/layouts/settings/layout';
import { ChevronDownIcon } from 'lucide-react';
import { useState } from 'react';

const breadcrumbs: BreadcrumbItem[] = [
  {
    title: 'Profile settings',
    href: '/settings/profile',
  },
];

export default function Profile({ mustVerifyEmail, status }: { mustVerifyEmail: boolean; status?: string }) {
  const { auth } = usePage<SharedData>().props;

  const [tglLahirOpen, setTglLahirOpen] = useState(false);
  const [tglLahir, setTglLahir] = useState<Date | undefined>(auth.user?.tgl_lahir ? new Date(auth.user.tgl_lahir) : undefined);
  const [jenisKelamin, setJenisKelamin] = useState(auth.user?.jenis_kelamin ?? '');

  return (
    <SettingsLayout breadcrumbs={breadcrumbs}>
      <div className="space-y-6">
        <HeadingSmall title="Informasi Pribadi" description="Update your name and email address, etc." />

        <Form
          method="patch"
          action={route('profile.update')}
          options={{
            preserveScroll: true,
          }}
          className="space-y-6"
        >
          {({ processing, recentlySuccessful, errors }) => (
            <>
              <div className="grid gap-2">
                <Label htmlFor="name">Name</Label>

                <Input
                  id="name"
                  className="mt-1 block w-full"
                  defaultValue={auth.user.name}
                  name="name"
                  required
                  autoComplete="name"
                  placeholder="Full name"
                />

                <InputError className="mt-2" message={errors.name} />
              </div>

              <div className="grid gap-2">
                <Label htmlFor="email">Email address</Label>

                <Input
                  id="email"
                  type="email"
                  className="mt-1 block w-full"
                  defaultValue={auth.user.email}
                  name="email"
                  required
                  autoComplete="username"
                  placeholder="Email address"
                />

                <InputError className="mt-2" message={errors.email} />
              </div>

              {mustVerifyEmail && auth.user.email_verified_at === null && (
                <div>
                  <p className="-mt-4 text-sm text-muted-foreground">
                    Your email address is unverified.{' '}
                    <Link
                      href={route('verification.send')}
                      method="post"
                      as="button"
                      className="text-foreground underline decoration-neutral-300 underline-offset-4 transition-colors duration-300 ease-out hover:decoration-current! dark:decoration-neutral-500"
                    >
                      Click here to resend the verification email.
                    </Link>
                  </p>

                  {status === 'verification-link-sent' && (
                    <div className="mt-2 text-sm font-medium text-green-600">A new verification link has been sent to your email address.</div>
                  )}
                </div>
              )}

              <div className="grid gap-2">
                <Label htmlFor="alamat">Alamat</Label>

                <Textarea id="alamat" className="mt-1 block w-full" defaultValue={auth.user.alamat} name="alamat" placeholder="Alamat rumah anda" />

                <InputError className="mt-2" message={errors.alamat} />
              </div>

              <div className="grid gap-2">
                <Label htmlFor="no_telp">No. Handphone</Label>

                <Input id="no_telp" type="tel" className="mt-1 block w-full" defaultValue={auth.user.no_telp} name="no_telp" placeholder="08..." />

                <InputError className="mt-2" message={errors.no_telp} />
              </div>

              <div className="grid grid-cols-1 gap-2 md:grid-cols-2">
                <div className="">
                  <Label htmlFor="tgl_lahir">Tanggal lahir</Label>

                  <Popover open={tglLahirOpen} onOpenChange={setTglLahirOpen}>
                    <PopoverTrigger asChild>
                      <Button variant="outline" className="w-full justify-between font-normal">
                        {tglLahir ? tglLahir.toLocaleDateString('id-ID', { day: '2-digit', month: 'long', year: 'numeric' }) : 'Pilih tanggal'}
                        <ChevronDownIcon />
                      </Button>
                    </PopoverTrigger>
                    <PopoverContent className="w-auto overflow-hidden p-0" align="start">
                      <Calendar
                        mode="single"
                        selected={tglLahir}
                        captionLayout="dropdown"
                        onSelect={(date) => {
                          setTglLahir(date);
                          setTglLahirOpen(false);
                        }}
                      />
                    </PopoverContent>
                  </Popover>

                  {/* Hidden input biar tetap ke-submit tapi tanggal lokal, bukan UTC */}
                  <input
                    type="hidden"
                    name="tgl_lahir"
                    value={tglLahir ? new Date(tglLahir.getTime() - tglLahir.getTimezoneOffset() * 60000).toISOString().split('T')[0] : ''}
                  />

                  <InputError className="mt-2" message={errors.tgl_lahir} />
                </div>

                <div>
                  <Label htmlFor="jenis_kelamin">Jenis kelamin</Label>
                  <Select
                    value={jenisKelamin}
                    onValueChange={(value: 'Laki-laki' | 'Perempuan' | '') => {
                      // update state aja, gak perlu setData
                      setJenisKelamin(value);
                    }}
                  >
                    <SelectTrigger className="w-full">
                      <SelectValue placeholder="Pilih jenis kelamin" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="Laki-Laki">Laki-laki</SelectItem>
                      <SelectItem value="Perempuan">Perempuan</SelectItem>
                    </SelectContent>
                  </Select>

                  {/* Hidden input juga */}
                  <input type="hidden" name="jenis_kelamin" value={jenisKelamin} />

                  <InputError className="mt-2" message={errors.jenis_kelamin} />
                </div>
              </div>

              <div className="flex items-center gap-4">
                <Button disabled={processing}>Save</Button>

                <Transition
                  show={recentlySuccessful}
                  enter="transition ease-in-out"
                  enterFrom="opacity-0"
                  leave="transition ease-in-out"
                  leaveTo="opacity-0"
                >
                  <p className="text-sm text-neutral-600">Saved</p>
                </Transition>
              </div>
            </>
          )}
        </Form>
      </div>

      <DeleteUser />
    </SettingsLayout>
  );
}
