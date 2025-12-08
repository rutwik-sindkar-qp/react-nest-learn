import {useState} from 'react'
import {API_BASE_URL} from '../../../constants/appConstants'
import type {ITodo} from '../../../types/ITodo'

const callCreateApi = async (title: string): Promise<ITodo> => {
  const newTodo = await fetch(`${API_BASE_URL}todos`, {
    method: 'POST',
    headers: {
      // eslint-disable-next-line @typescript-eslint/naming-convention
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({title}),
  })
    .then(response => {
      if (!response.ok) {
        throw new Error('Network response was not ok')
      }
      return response.json()
    })
    .then(data => {
      return data.data as ITodo
    })

  return newTodo
}

const useCreateTodo = (): {
  status: 'idle' | 'in-progress' | 'error' | 'success'
  error: string | null
  data: ITodo | null
  createTodo: (title: string) => Promise<void>
} => {
  const [status, setStatus] = useState<
    'idle' | 'in-progress' | 'error' | 'success'
  >('idle')
  const [error, setError] = useState<string | null>(null)
  const [data, setData] = useState<ITodo | null>(null)

  const createTodo = async (title: string): Promise<void> => {
    setStatus('in-progress')
    try {
      const newTodo = await callCreateApi(title)
      setData(newTodo)
      setStatus('success')
    } catch (err) {
      setError(err instanceof Error ? err.message : 'An error occurred')
      setStatus('error')
    }
  }

  return {
    status,
    error,
    data,
    createTodo,
  }
}

export const createTodoApi = {
  useCreateTodo,
} as const
