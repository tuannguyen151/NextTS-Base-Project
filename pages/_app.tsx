import { fontBase } from '@/lib/font'
import '@/styles/globals.css'
import type { AppProps } from 'next/app'
import Head from 'next/head'

import { BaseProvider } from '@/contexts'

export default function App({ Component, pageProps }: AppProps) {
  return (
    <>
      <Head>
        <meta charSet='UTF-8' />
        <meta name='viewport' content='width=device-width, initial-scale=1' />
      </Head>
      <main className={`${fontBase.variable} font-sans`}>
        <BaseProvider>
          <Component {...pageProps} />
        </BaseProvider>
      </main>
    </>
  )
}
