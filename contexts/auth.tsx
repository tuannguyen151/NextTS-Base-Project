import {
  createContext,
  useState,
  useContext,
  useEffect,
  ReactNode
} from 'react'
import Cookies from 'js-cookie'
import { useRouter } from 'next/router'

import api from '@/lib/api'
import { LOGIN_API, PROFILE_API } from '@/constants'
import { ILoginRequest } from '@/types/request'
import { ILoginResponse, IUserResponse } from '@/types/response'

const userLocal: IUserResponse | undefined = Cookies.get('user')
  ? JSON.parse(Cookies.get('user') as string)
  : undefined

const isLoggedInLocal = !!Cookies.get('token')

const AuthContext = createContext<{
  isLoggedIn: boolean
  isLoading: boolean
  user: IUserResponse | undefined
  login: (payload: ILoginRequest) => Promise<void>
  logout: () => void
}>({
  isLoggedIn: isLoggedInLocal,
  isLoading: true,
  user: userLocal,
  login: () => Promise.reject(),
  logout: () => undefined
})

export const AuthProvider = ({ children }: { children: ReactNode }) => {
  const router = useRouter()
  const [user, setUser] = useState<any>(userLocal)
  const [isLoading, setIsLoading] = useState<boolean>(true)

  useEffect(() => {
    async function loadUserFromCookies() {
      const token = Cookies.get('token')

      if (token) {
        const { data: user } = await api.get<IUserResponse>(PROFILE_API)

        const userCookies = Cookies.get('user')

        if (JSON.stringify(user) !== userCookies) {
          setUser(user)
          Cookies.set('user', JSON.stringify(user), {
            expires: Number(process.env.NEXT_PUBLIC_LOGIN_EXPIRES_DAY || 180)
          })
        }
      }

      setIsLoading(false)
    }

    loadUserFromCookies()
  }, [])

  const login = async ({ username, password }: ILoginRequest) => {
    const {
      data: { token }
    } = await api.post<ILoginResponse>(LOGIN_API, {
      account: username,
      password
    })

    if (token) {
      Cookies.set('token', token, {
        expires: Number(process.env.NEXT_PUBLIC_LOGIN_EXPIRES_DAY || 180)
      })

      const { data: user } = await api.get<IUserResponse>(PROFILE_API)

      Cookies.set('user', JSON.stringify(user), {
        expires: Number(process.env.NEXT_PUBLIC_LOGIN_EXPIRES_DAY || 180)
      })

      setUser(user)
    }
  }

  const logout = () => {
    Cookies.remove('token')
    Cookies.remove('user')
    setUser(null)

    router.push('/auth/login')
  }

  return (
    <AuthContext.Provider
      value={{ isLoggedIn: !!user, user, login, isLoading, logout }}
    >
      {children}
    </AuthContext.Provider>
  )
}

export const useAuth = () => useContext(AuthContext)
