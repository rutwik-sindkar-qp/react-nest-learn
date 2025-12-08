import {screen} from '@testing-library/dom'
import {App} from '../../../App'
import {testUtil} from '../../../tests/testUtil'
import userEvent from '@testing-library/user-event'
import {http, HttpResponse, mswTestServer} from '../../../msw/mswTestServer'
import {API_BASE_URL} from '../../../constants/appConstants'

const todoDetailsRoute = {route: '/todos/1'}
const todosRoute = {route: '/todos'}

describe('TodoDetailScreen', () => {
  test('Todo detail shows title and back button', async () => {
    await testUtil.renderWithRoute(<App />, todoDetailsRoute)

    const titleInput = screen.getByRole('textbox', {name: /title/i})
    expect(titleInput).toHaveValue('Todo 1')

    screen.getByRole('link', {name: /go back to todos/i})

    screen.getByRole('button', {name: /save/i})
  })

  test('User should be able to navigate from todo list', async () => {
    await testUtil.renderWithRoute(<App />, todosRoute)

    // open the todo detail
    const todoDetailLink = await screen.findByRole('link', {name: /todo 2/i})
    await userEvent.click(todoDetailLink)

    // verify the todo detail is displayed
    const todoTitleInput = await screen.findByRole('textbox', {name: /title/i})
    expect(todoTitleInput).toHaveValue('Todo 2')
    screen.getByRole('link', {name: /go back to todos/i})
  })
})
