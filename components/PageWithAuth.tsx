// Using HOCs (higher-order component) for authentication Page Client

import { NextComponentType, NextPageContext } from 'next'
import Head from 'next/head'
import { useAuth } from '@/contexts/auth'
import Unauthorized from './templates/unauthorized'
import Loading from './templates/loading'

function PageWithAuth<T extends NextPageContext>(
  Component: NextComponentType<T, any, any>
) {
  const Auth = (pageProps: T) => {
    const { isLoggedIn, isLoading } = useAuth()

    if (isLoading)
      return (
        <>
          <Head>
            <title>Loading</title>
          </Head>

          <Loading />
        </>
      )

    if (!isLoading && !isLoggedIn)
      return (
        <>
          <Head>
            <title>Unauthorized</title>
          </Head>

          <Unauthorized />
        </>
      )

    return <Component {...pageProps} />
  }

  if (Component.getInitialProps)
    Auth.getInitialProps = Component.getInitialProps

  return Auth
}

export default PageWithAuth
