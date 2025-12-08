import {screen} from '@testing-library/dom'
import {App} from '../../../App'
import {testUtil} from '../../../tests/testUtil'
import userEvent from '@testing-library/user-event'
import {http, HttpResponse, mswTestServer} from '../../../msw/mswTestServer'
import {API_BASE_URL} from '../../../constants/appConstants'

const todosRoute = {route: '/todos'}

describe('TodoListScreen', () => {
  test('User should a todos list', async () => {
    await testUtil.renderWithRoute(<App />, todosRoute)

    // pattern that ends with 'todo 1'
    screen.getByRole('cell', {name: 'Todo 1'})
    screen.getByRole('cell', {name: /todo 2/i})
    screen.getByRole('cell', {name: /todo 3/i})
  })

  test('User should be able to create a todo', async () => {
    await testUtil.renderWithRoute(<App />, todosRoute)

    // open the create todo dialog
    const createTodoButton = await screen.findByRole('button', {
      name: /create todo/i,
    })
    await userEvent.click(createTodoButton)
    screen.getByRole('dialog')

    const titleBox = screen.getByRole('textbox', {name: /title/i})
    const saveButton = screen.getByRole('button', {name: /save/i})

    // Check for validation message
    await userEvent.click(saveButton)
    screen.getByText('Please enter a title')

    // enter title and click save
    await userEvent.type(titleBox, 'Test Todo')
    expect(screen.queryByText('Please enter a title')).toBeNull()
    expect(saveButton.hasAttribute('disabled')).toBe(false)

    await userEvent.click(saveButton)

    await screen.findByText(/Test Todo/i)
  })

  test('welcome message is displayed if there are no todos', async () => {
    mswTestServer.use(
      http.get(`${API_BASE_URL}todos`, async () => {
        return HttpResponse.json({
          data: {
            data: [],
            page: 1,
            pageSize: 10,
            totalCount: 0,
          },
        })
      }),
    )
    await testUtil.renderWithRoute(<App />, todosRoute)

    // verify welcome message is displayed with create todo button p
    screen.getByText(/welcome to the todo app/i)
    screen.getByRole('button', {name: /create todo/i})
  })

  test('welcome message is not displayed if there are todos', async () => {
    await testUtil.renderWithRoute(<App />, todosRoute)

    // verify welcome message is not displayed
    expect(screen.queryByText(/welcome to the todo app/i)).toBeNull()
    expect(screen.queryByRole('button', {name: /create todo/i})).not.toBeNull()
  })

  test('Error message is displayed if create todo api call fails', async () => {
    mswTestServer.use(
      http.post(`${API_BASE_URL}todos`, async () => {
        return HttpResponse.error()
      }),
    )

    await testUtil.renderWithRoute(<App />, todosRoute)

    // open the create todo dialog
    const createTodoButton = screen.getByRole('button', {name: /create todo/i})
    await userEvent.click(createTodoButton)
    screen.getByRole('dialog')

    const titleBox = screen.getByRole('textbox', {name: /title/i})
    const saveButton = screen.getByRole('button', {name: /save/i})

    // enter title and click save
    await userEvent.type(titleBox, 'Test Todo')
    expect(screen.queryByText('Please enter a title')).toBeNull()
    expect(saveButton.hasAttribute('disabled')).toBe(false)

    console.error = vi.fn() // Mock console.error to avoid logging errors in test output
    await userEvent.click(saveButton)

    // verify error message is displayed
    await screen.findByText(/failed to fetch/i)
  })

  test('Error message is displayed if fetch todos api call fails', async () => {
    console.error = vi.fn() // Mock console.error to avoid logging errors in test output
    mswTestServer.use(
      http.get(`${API_BASE_URL}todos`, async () => {
        return HttpResponse.error()
      }),
    )

    await testUtil.renderWithRoute(<App />, todosRoute)

    // verify error message is displayed
    await screen.findByText(/failed to fetch/i)
  })

  describe('Pagination', () => {
    test('should go to next and previous page on using next/previous buttons', async () => {
      await testUtil.renderWithRoute(<App />, todosRoute)

      // previous button should not be visible on first page
      expect(
        screen.queryByRole('button', {name: /previous/i}),
      ).not.toBeInTheDocument()

      const nextButton = screen.getByRole('button', {name: /next/i})
      await userEvent.click(nextButton)

      // verify that the next page is displayed
      screen.getByRole('cell', {name: /todo 11/i})
      screen.getByRole('cell', {name: /todo 12/i})

      // previous button should be visible now
      const previousButton = screen.getByRole('button', {name: /previous/i})
      await userEvent.click(previousButton)

      // verify that the previous page is displayed
      screen.getByRole('cell', {name: 'Todo 1'})
      screen.getByRole('cell', {name: /todo 2/i})
    })

    test('previous and next buttons should not be visible on first and last page respectively', async () => {
      await testUtil.renderWithRoute(<App />, todosRoute)

      // previous button should not be visible on first page
      expect(
        screen.queryByRole('button', {name: /previous/i}),
      ).not.toBeInTheDocument()

      // There are three pages of todos, so next button should be visible
      const nextButton = screen.getByRole('button', {name: /next/i})
      await userEvent.click(nextButton)
      await screen.findByRole('cell', {name: /todo 11/i})
      await userEvent.click(screen.getByRole('button', {name: /next/i}))
      await screen.findByRole('cell', {name: /todo 21/i})
      // Now we are on the last page, so next button should not be visible
      expect(
        screen.queryByRole('button', {name: /next/i}),
      ).not.toBeInTheDocument()

      // next button should not be visible on last page
      expect(
        screen.queryByRole('button', {name: /next/i}),
      ).not.toBeInTheDocument()
    })
  })

  test('should not show next & previous button if there are no todos', async () => {
    mswTestServer.use(
      http.get(`${API_BASE_URL}todos`, async () => {
        return HttpResponse.json({
          data: {
            data: [],
            page: 1,
            pageSize: 10,
            totalCount: 0,
          },
        })
      }),
    )

    await testUtil.renderWithRoute(<App />, todosRoute)

    // verify next and previous buttons are not displayed
    expect(
      screen.queryByRole('button', {name: /next/i}),
    ).not.toBeInTheDocument()
    expect(
      screen.queryByRole('button', {name: /previous/i}),
    ).not.toBeInTheDocument()
  })
})
