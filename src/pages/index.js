import Head from 'next/head';

export default function Home() {
  console.log(process.env.NEXT_PUBLIC_SUPABASE_URL);
  return (
    <>
      <Head>
        <title>How Old</title>
      </Head>
    </>
  );
}
