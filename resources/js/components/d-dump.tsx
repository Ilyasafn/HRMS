import { FC } from 'react';

type Props = {
  content: unknown;
};

const DDump: FC<Props> = ({ content }) => {
  return <pre className="font-mono">{JSON.stringify(content, null, 2)}</pre>;
};

export default DDump;
