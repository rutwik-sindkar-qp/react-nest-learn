import {
  WuModal,
  WuModalHeader,
  WuModalContent,
  WuModalFooter,
  WuModalClose,
  WuButton,
  WuFormGroup,
  WuInput,
  WuInputError,
  WuLabel,
} from '@npm-questionpro/wick-ui-lib'
import React, {useEffect} from 'react'
import type {ITodo} from '../../../types/ITodo'
import {createTodoApi} from '../api/createTodoApi'

interface IProps {
  onTodoCreated: (todo: ITodo) => void
  isOpen: boolean
  onOpenChange: (isOpen: boolean) => void
}

export const CreateTodoModal: React.FC<IProps> = ({
  isOpen,
  onTodoCreated,
  onOpenChange,
}) => {
  const {status, error, data, createTodo} = createTodoApi.useCreateTodo()
  const [title, setTitle] = React.useState<string>('')
  const [showValidationError, setShowValidationError] =
    React.useState<boolean>(false)

  useEffect(() => {
    if (status === 'success') {
      setTitle('')
      setShowValidationError(false)
      onTodoCreated(data!)
      onOpenChange(false)
    }
  }, [status, onTodoCreated, onOpenChange])

  if (status === 'error') {
    throw new Error(error ?? 'An error occurred while creating todo')
  }

  const handleSave = async (): Promise<void> => {
    if (title.trim() === '') {
      setShowValidationError(true)
      return
    } else {
      setShowValidationError(false)
    }

    createTodo(title)
  }

  const handleUpdateTitle = (e: React.ChangeEvent<HTMLInputElement>): void => {
    setTitle(e.target.value)
    if (e.target.value.trim() !== '') {
      setShowValidationError(false)
    }
  }

  const isLoading = status === 'in-progress'

  return (
    <WuModal open={isOpen} onOpenChange={onOpenChange}>
      <WuModalHeader>Create Todo</WuModalHeader>
      <WuModalContent>
        {/* <input
          type="text"
          title={title}
          onChange={handleUpdateTitle}
          placeholder="Title"
          aria-label="title"
          required
        />
        {showValidationError && (
          <p style={{color: 'red'}}>Please enter a title</p>
        )} */}
        <WuFormGroup
          className="wu-form-group"
          Input={
            <WuInput
              type="text"
              title={title}
              onChange={handleUpdateTitle}
              placeholder="Title"
              aria-label="title"
              required
              style={{padding: '10px'}}
            />
          }
          Error={
            showValidationError ? (
              <WuInputError message="Please enter a title" />
            ) : null
          }
          Label={<WuLabel>Todo Title</WuLabel>}
        ></WuFormGroup>
      </WuModalContent>
      <WuModalFooter>
        <WuModalClose>Close</WuModalClose>
        <WuButton loading={isLoading} disabled={isLoading} onClick={handleSave}>
          Save
        </WuButton>
      </WuModalFooter>
    </WuModal>
  )
}
