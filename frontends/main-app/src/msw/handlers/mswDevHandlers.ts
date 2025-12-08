import {HttpResponse, http} from 'msw'
import {userMockDb} from '../mockDbs/userMockDb'
import {API_BASE_URL, IS_MOCK_ENV} from '../../constants/appConstants'
import type {IUser} from '../../types/IUser'
import type {ITodo} from '../../types/ITodo'
import {todosMockDb} from '../mockDbs/todosMockDb'

const sendResponse = <T>(res: T): HttpResponse<{data: T}> => {
  return HttpResponse.json({data: res})
}

const delayedResponse = async (delay = 1000): Promise<void> => {
  if (IS_MOCK_ENV)
    await new Promise(resolve => {
      setTimeout(() => {
        resolve(true)
      }, delay)
    })
}

const DEFAULT_PAGE_SIZE = 10

export const mswDevHandlers = [
  http.get(`${API_BASE_URL}user`, () => {
    const user = userMockDb.getUser()
    return sendResponse<IUser>(user)
  }),
  http.get(`${API_BASE_URL}todos/:id`, async ({params}) => {
    await delayedResponse()

    const todoId = params.id as string
    if (!todoId) {
      return HttpResponse.json({error: 'Todo ID is required'}, {status: 400})
    }

    const todo = todosMockDb.getTodoById(todoId)
    if (!todo) {
      return HttpResponse.json({error: 'Todo not found'}, {status: 404})
    }
    return sendResponse(todo)
  }),
  http.post(`${API_BASE_URL}todos`, async ({request}) => {
    await delayedResponse()

    const {title} = (await request.json()) as {title: string}
    if (!title || title.trim() === '') {
      return HttpResponse.json({error: 'Title is required'}, {status: 400})
    }

    const newTodo: ITodo = todosMockDb.createTodo(title)
    return sendResponse(newTodo)
  }),
  http.get(`${API_BASE_URL}todos`, async ({request}) => {
    await delayedResponse()
    const url = new URL(request.url)
    const pageSizeString = url.searchParams.get('pageSize')
    const pageString = url.searchParams.get('page')
    const pageSize = pageSizeString ? Number(pageSizeString) : DEFAULT_PAGE_SIZE

    const page = pageString ? Number(pageString) : 1

    const todos = todosMockDb.getTodos(page, pageSize)
    const response = {
      page,
      pageSize,
      totalCount: todosMockDb.getTodosCount(),
      data: todos,
    }

    return sendResponse(response)
  }),
]
