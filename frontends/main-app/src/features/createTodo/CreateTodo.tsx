import {WuButton} from '@npm-questionpro/wick-ui-lib'
import React from 'react'
import type {ITodo} from '../../types/ITodo'
import {CreateTodoModal} from './components/CreateTodoModal'

interface IProps {
  onTodoCreated: (todo: ITodo) => void
}

export const CreateTodo: React.FC<IProps> = ({onTodoCreated}) => {
  const [isOpen, setIsOpen] = React.useState<boolean>(false)

  return (
    <>
      <WuButton onClick={() => setIsOpen(true)}>Create Todo</WuButton>
      <CreateTodoModal
        isOpen={isOpen}
        onOpenChange={setIsOpen}
        onTodoCreated={onTodoCreated}
      />
    </>
  )
}
