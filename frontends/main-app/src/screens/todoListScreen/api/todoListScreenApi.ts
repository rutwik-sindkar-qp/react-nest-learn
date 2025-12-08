import {API_BASE_URL} from '../../../constants/appConstants'
import type {ITodo} from '../../../types/ITodo'
import {useQuery, type UseQueryResult} from '@tanstack/react-query'
import type {IPager} from '../../../types/IPager'
import type {IPagerServerResponse} from '../../../types/IPagerServerResponse'

const fetchAllTodos = async (
  pager: IPager,
): Promise<IPagerServerResponse<ITodo>> => {
  const response = await fetch(
    `${API_BASE_URL}todos?page=${pager.page}&pageSize=${pager.pageSize}`,
    {
      method: 'GET',
      headers: {
        // eslint-disable-next-line @typescript-eslint/naming-convention
        'Content-Type': 'application/json',
      },
    },
  )

  if (!response.ok) {
    throw new Error('Failed to fetch todos')
  }

  const data = await response.json()
  return data.data as IPagerServerResponse<ITodo>
}

const useGetTodos = (
  pager: IPager,
): UseQueryResult<IPagerServerResponse<ITodo>, Error> => {
  return useQuery({
    queryKey: ['todos', pager],
    queryFn: () => fetchAllTodos(pager),
  })
}

export const todoListScreenApi = {
  useGetTodos,
} as const
