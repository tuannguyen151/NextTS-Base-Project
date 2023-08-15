import { useCallback, useReducer } from 'react'

import api from '@/lib/api'
import { replaceValuesInUrl } from '@/lib/utils'

interface IDeleteMethodReducer<T> {
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

function deleteMethodReducer<T>(
  state: IDeleteMethodReducer<T>['state'],
  action: IDeleteMethodReducer<T>['action']
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

export default function useDeleteMethod<IResponse>(apiUrl: string) {
  const [state, dispatch] = useReducer(deleteMethodReducer<IResponse>, {
    isLoading: false,
    isError: false,
    isSuccess: false
  })

  const executeApi = useCallback(
    async (urlKeyValueOptions: { [urlKey: string]: string | number } = {}) => {
      try {
        dispatch({
          type: 'start'
        })

        const { data } = await api.delete<IResponse>(
          replaceValuesInUrl(apiUrl, urlKeyValueOptions)
        )

        dispatch({
          type: 'success',
          data: data
        })
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
