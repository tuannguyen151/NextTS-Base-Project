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

      <div className='h-96 bg-red-200'></div>
    </Layout>
  )
}
