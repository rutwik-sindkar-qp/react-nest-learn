import {Navigate, Route, Routes} from 'react-router'
import {TodoListScreen} from './screens/todoListScreen/TodoListScreen'
import {TodoDetailScreen} from './screens/todoDetailScreen/TodoDetailScreen'

export const AppRoutes: React.FC<React.PropsWithChildren> = () => {
  return (
    <Routes>
      <Route path="/todos" element={<TodoListScreen />} />
      <Route path="/todos/:todoId" element={<TodoDetailScreen />} />

      <Route path="*" element={<Navigate to="/todos" replace />} />
    </Routes>
  )
}
