import {
  WuButton,
  WuFormGroup,
  WuInput,
  WuLabel,
} from '@npm-questionpro/wick-ui-lib'
import {Link, useParams} from 'react-router'
import {todoDetailApi} from './api/todoDetailApi'
import styles from './TodoDetailScreen.module.css'

const useTodoIdFromParams = (): number => {
  const {todoId} = useParams<{todoId: string}>()
  if (!todoId || todoId.trim() === '' || isNaN(Number(todoId))) {
    throw new Error(`Invalid todoId: ${todoId}`)
  }

  const id = Number(todoId)
  return id
}

export const TodoDetailScreen: React.FC<React.PropsWithChildren> = () => {
  const todoId = useTodoIdFromParams()
  const {data, status, error} = todoDetailApi.useGetTodoById(todoId)

  if (status === 'pending') {
    return <div>Loading...</div>
  }
  if (status === 'error') {
    throw new Error(
      error?.message ??
        'An error occurred while fetching todo for id: ' + todoId,
    )
  }

  const todo = data
  if (!todo) {
    throw new Error(`Todo with id ${todoId} not found`)
  }

  return (
    <div className={styles.container}>
      <Link to="/todos">Go back to todos</Link>
      <WuFormGroup
        className="wu-form-group"
        Input={
          <WuInput
            type="text"
            value={todo.title}
            onChange={(): void => {}}
            placeholder="Title"
            aria-label="title"
            required
          />
        }
        /* Error={
                  showValidationError ? (
                    <WuInputError message="Please enter a title" />
                  ) : null
                } */
        Label={<WuLabel>Title</WuLabel>}
      />
      <p>
        This is the Todo Detail Screen. You can view and manage your todo
        details here.
      </p>
      <WuButton>Save</WuButton>
    </div>
  )
}
