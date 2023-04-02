import Axios, {
  AxiosError,
  AxiosRequestHeaders,
  AxiosResponse,
  InternalAxiosRequestConfig
} from 'axios'
import Cookies from 'js-cookie'

const api = Axios.create({
  baseURL: process.env.NEXT_PUBLIC_BACKEND_URL,
  headers: {
    Accept: 'application/json',
    'Content-Type': 'application/json'
  }
})

const requestHandler = (request: InternalAxiosRequestConfig) => {
  const authToken = Cookies.get('token')

  if (authToken)
    request.headers = {
      Authorization: `Bearer ${authToken}`
    } as AxiosRequestHeaders

  return request
}

const responseHandler = (response: AxiosResponse) => {
  return response.data
}

const errorHandler = (error: AxiosError) => {
  const { response } = error

  switch (response?.status) {
    case 401:
      Cookies.remove('token')
      Cookies.remove('user')

      // Client site then redirect
      if (typeof window !== 'undefined') window.location.href = '/auth/login'
      break
    default:
      break
  }

  return Promise.reject(error.response?.data)
}

api.interceptors.request.use(
  (request) => requestHandler(request),
  (error) => errorHandler(error)
)

api.interceptors.response.use(
  (response) => responseHandler(response),
  (error) => errorHandler(error)
)

export default api
