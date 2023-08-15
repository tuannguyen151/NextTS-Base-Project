import { useCallback, useReducer } from 'react'

import api from '@/lib/api'
import { replaceValuesInUrl } from '@/lib/utils'

interface IPatchMethodReducer<T> {
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

function PatchMethodReducer<T>(
  state: IPatchMethodReducer<T>['state'],
  action: IPatchMethodReducer<T>['action']
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

export default function usePatchMethod<IRequest, IResponse>(apiUrl: string) {
  const [state, dispatch] = useReducer(PatchMethodReducer<IResponse>, {
    isLoading: false,
    isError: false,
    isSuccess: false
  })

  const executeApi = useCallback(
    async (
      payload: IRequest,
      urlKeyValueOptions: { [urlKey: string]: string | number } = {}
    ) => {
      try {
        dispatch({
          type: 'start'
        })

        const { data } = await api.patch<IResponse>(
          replaceValuesInUrl(apiUrl, urlKeyValueOptions),
          payload
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
