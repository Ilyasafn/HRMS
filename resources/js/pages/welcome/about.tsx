import MarkdownReader from '@/components/markdown-reader';
import { FC } from 'react';
import WelcomeLayout from './layouts/welcome-layout';

type Props = {
  content: string;
};

const AboutPage: FC<Props> = ({ content = '' }) => {
  return (
    <WelcomeLayout>
      <MarkdownReader className="!max-w-full break-all" content={content} />
    </WelcomeLayout>
  );
};

export default AboutPage;
