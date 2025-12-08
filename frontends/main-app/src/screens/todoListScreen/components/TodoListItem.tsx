import {Link} from 'react-router'
import type {ITodo} from '../../../types/ITodo'
import styles from './TodoListItem.module.css'

interface IProps {
  todo: ITodo
}

export const TodoListItem: React.FC<IProps> = ({todo}) => {
  return (
    <tr>
      <td className={styles.todoId}>{todo.id}</td>
      <td>
        <Link to={`/todos/${todo.id}`}>{todo.title}</Link>
      </td>
    </tr>
  )
}
