import type { MetaFunction } from '@vercel/remix';

export const meta: MetaFunction = () => {
  return [
    { title: 'How Old' },
    { name: 'description', content: 'Welcome to Mantine!' },
  ];
};

export default function Index() {
  return <div></div>;
}
