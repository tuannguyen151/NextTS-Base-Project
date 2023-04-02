import { ReactNode } from 'react'
import { AuthProvider } from './auth'

export function BaseProvider({ children }: { children: ReactNode }) {
  return <AuthProvider>{children}</AuthProvider>
}
