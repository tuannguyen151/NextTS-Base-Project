import Head from 'next/head'

import Layout from '@/components/Layout'

export default function Home() {
  return (
    <Layout>
      <Head>
        <title>HOME</title>
        <meta name='description' content='HOME description' />
      </Head>

      <h1>Home</h1>

      <div className='bg-red-200 h-96'></div>
    </Layout>
  )
}
