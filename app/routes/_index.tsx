import type { MetaFunction } from '@remix-run/node';

export const meta: MetaFunction = () => {
  return [
    { title: 'How Old' },
    { name: 'description', content: 'Welcome to Mantine!' },
  ];
};

export default function Index() {
  return <div></div>;
}
