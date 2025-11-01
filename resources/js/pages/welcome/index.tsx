import WelcomeLayout from './layouts/welcome-layout';

export default function Welcome() {
  return (
    <WelcomeLayout>
      <div className="flex min-h-[60vh] items-center justify-center">
        <div className="text-center">
          <h1 className="mb-4 text-4xl font-bold">Selamat Datang di HRMS</h1>
          <p className="text-lg text-gray-500">Sistem Manajemen Sumber Daya Manusia</p>
        </div>
      </div>
    </WelcomeLayout>
  );
}
