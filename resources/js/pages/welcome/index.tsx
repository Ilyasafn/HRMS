import LaravelInfoCard from './components/laravel-info-card';
import WelcomeLayout from './layouts/welcome-layout';

export default function Welcome() {
  return (
    <WelcomeLayout>
      <LaravelInfoCard />
    </WelcomeLayout>
  );
}
