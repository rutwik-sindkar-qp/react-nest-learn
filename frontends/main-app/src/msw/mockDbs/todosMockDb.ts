import type {ITodo} from '../../types/ITodo'

const initTodos = (): ITodo[] => {
  return Array.from({length: 21}, (_, index) => ({
    id: index + 1,
    title: `Todo ${index + 1}`,
    status: index % 2 === 0 ? 'active' : 'completed',
  })) as ITodo[]
}

let todos: ITodo[] = initTodos()

export const todosMockDb = {
  reset: (): void => {
    todos = initTodos()
  },
  getTodosCount: (): number => {
    return todos.length
  },
  getTodos: (
    page: number,
    pageSize: number,
  ): {
    id: number
    title: string
    status: 'active' | 'completed'
  }[] => {
    if (isNaN(page) || page <= 0) {
      throw new Error(`Invalid page number: ${page}`)
    }
    if (!pageSize || pageSize <= 0) {
      throw new Error(`Invalid pageSize: ${pageSize}`)
    }
    const startIndex = (page - 1) * pageSize
    const endIndex = startIndex + pageSize
    const todosForPage = todos.slice(startIndex, endIndex)
    return [...todosForPage]
  },
  getTodoById: (id: string): ITodo | null => {
    const todoId = Number(id)
    if (isNaN(todoId)) {
      throw new Error(`Invalid todoId: ${id}`)
    }
    const todo = todos.find(t => t.id === todoId)
    if (!todo) {
      throw new Error(`Todo with id ${todoId} not found`)
    }
    return {...todo}
  },
  createTodo: (title: string): ITodo => {
    if (!title || title.trim() === '') {
      throw new Error('Title is required')
    }

    const newTodo: ITodo = {
      id: todos.length + 1,
      title,
      status: 'active',
    }
    // add to the top
    todos.unshift(newTodo)
    return {...newTodo}
  },
}
