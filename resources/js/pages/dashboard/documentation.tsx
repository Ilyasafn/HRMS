import MarkdownReader from '@/components/markdown-reader';
import AppLayout from '@/layouts/app-layout';
import { FC } from 'react';

type Props = {
  content: string;
};

const Documentation: FC<Props> = ({ content }) => {
  return (
    <AppLayout title="App documentation">
      <MarkdownReader content={content} className="mx-auto max-w-3xl" />
    </AppLayout>
  );
};

export default Documentation;
