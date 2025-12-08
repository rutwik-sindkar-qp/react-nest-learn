import React from 'react'
import type {ITodo} from '../../types/ITodo'
import {todoListScreenApi} from './api/todoListScreenApi'
import {CreateTodo} from '../../features/createTodo/CreateTodo'
import styles from './TodoListScreen.module.css'
import {TodoListItem} from './components/TodoListItem'
import {WuButton, WuLoader} from '@npm-questionpro/wick-ui-lib'
import type {IPager} from '../../types/IPager'
import {useSearchParams} from 'react-router'

interface IProps {
  userId?: string
}

const DEFAULT_PAGE_SIZE = 10

export const TodoListScreen: React.FC<IProps> = () => {
  const [searchParams, setSearchParams] = useSearchParams()
  const pager = React.useMemo(() => {
    const page = parseInt(searchParams.get('page') ?? '1', 10)
    const pageSize = parseInt(
      searchParams.get('pageSize') ?? `${DEFAULT_PAGE_SIZE}`,
      10,
    )
    return {
      page: isNaN(page) ? 1 : page,
      pageSize: isNaN(pageSize) ? DEFAULT_PAGE_SIZE : pageSize,
    }
  }, [searchParams.get('page'), searchParams.get('pageSize')])

  const setPager = (newPager: IPager): void => {
    setSearchParams({
      page: newPager.page.toString(),
      pageSize: newPager.pageSize.toString(),
    })
  }

  const {data, refetch, status, error} = todoListScreenApi.useGetTodos(pager)
  const handleTodoCreated = (_todo: ITodo): void => {
    refetch()
  }
  const handleNextPage = (): void => {
    setPager({
      ...pager,
      page: pager.page + 1,
    })
  }

  const handlePreviousPage = (): void => {
    setPager({
      ...pager,
      page: Math.max(pager.page - 1, 1), // Ensure page does not go below 1
    })
  }

  if (status === 'pending') {
    return (
      <div className={styles.loading}>
        <WuLoader message="Loading..." />
      </div>
    )
  }
  if (status === 'error') {
    throw new Error(error?.message ?? 'An error occurred while fetching todos')
  }

  const todos = data?.data
  if (todos === null) throw new Error('Todos data is null')

  const isTodosEmpty = todos.length === 0

  const isFirstPage = pager.page === 1
  const lastPage = Math.ceil(data?.totalCount / pager.pageSize) || 1
  const isLastPage = pager.page >= lastPage

  return (
    <div className={styles.container}>
      <div className={styles.topBar}>
        {isTodosEmpty && <h1>Welcome to the Todo App</h1>}
        <CreateTodo onTodoCreated={handleTodoCreated} />
        <div className={styles.pagination}>
          {!isFirstPage && (
            <WuButton onClick={handlePreviousPage} variant="secondary">
              Previous
            </WuButton>
          )}
          {!isLastPage && (
            <WuButton onClick={handleNextPage} variant="secondary">
              Next
            </WuButton>
          )}
        </div>
      </div>

      {!isTodosEmpty && (
        <div>
          <table>
            <thead>
              <tr>
                <th>#</th>
                <th>Title</th>
              </tr>
            </thead>
            <tbody>
              {todos.map(todo => (
                <TodoListItem key={todo.id} todo={todo} />
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  )
}
