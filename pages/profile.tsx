import PageWithAuth from '@/components/PageWithAuth'
import { useAuth } from '@/contexts/auth'
import Head from 'next/head'

const Profile = () => {
  const { user } = useAuth()

  return (
    <>
      <Head>
        <title>Profile</title>
      </Head>
      <div>{user?.email}</div>
    </>
  )
}

export default PageWithAuth(Profile)
