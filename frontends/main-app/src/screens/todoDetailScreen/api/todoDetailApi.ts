import {useQuery} from '@tanstack/react-query'
import type {ITodo} from '../../../types/ITodo'

const fetchTodoById = async (todoId: number): Promise<ITodo> => {
  const response = await fetch(`/api/todos/${todoId}`, {
    method: 'GET',
    headers: {
      // eslint-disable-next-line @typescript-eslint/naming-convention
      'Content-Type': 'application/json',
    },
  })

  if (!response.ok) {
    throw new Error(`Failed to fetch todo with id ${todoId}`)
  }

  const apiResponse = await response.json()
  return apiResponse.data
}

export const todoDetailApi = {
  useGetTodoById: (todoId: number) => {
    return useQuery<ITodo>({
      queryKey: ['todos', todoId],
      queryFn: () => fetchTodoById(todoId),
    })
  },
} as const
