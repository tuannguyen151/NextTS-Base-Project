import { useCallback, useReducer } from 'react'

import api from '@/lib/api'

interface IPostMethodReducer<T> {
  state: {
    isLoading: boolean
    isError: boolean
    isSuccess: boolean
    data?: T
    error?: {
      type: string
      description: string
    }
  }
  action: {
    type: 'start' | 'success' | 'error'
    error?: {
      type: string
      description: string
    }
    data?: T
  }
}

function postMethodReducer<T>(
  state: IPostMethodReducer<T>['state'],
  action: IPostMethodReducer<T>['action']
) {
  switch (action.type) {
    case 'start':
      return { ...state, isLoading: true, isSuccess: false }
    case 'success':
      return {
        ...state,
        isLoading: false,
        isError: false,
        isSuccess: true,
        data: action.data
      }
    case 'error':
      return {
        ...state,
        isLoading: false,
        isError: true,
        isSuccess: false,
        error: action.error
      }

    default:
      return state
  }
}

export default function usePostMethod<IRequest, IResponse>(apiUrl: string) {
  const [state, dispatch] = useReducer(postMethodReducer<IResponse>, {
    isLoading: false,
    isError: false,
    isSuccess: false
  })

  const executeApi = useCallback(
    async (payload: IRequest) => {
      try {
        dispatch({
          type: 'start'
        })

        const { data } = await api.post<IResponse>(apiUrl, payload)

        dispatch({
          type: 'success',
          data: data
        })

        return data
      } catch (error: any) {
        dispatch({
          type: 'error',
          error: {
            type: error?.error?.type,
            description: error?.error?.description
          }
        })
      }
    },
    [apiUrl]
  )

  return { ...state, executeApi }
}
