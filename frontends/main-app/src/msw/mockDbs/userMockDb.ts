import type {IUser} from '../../types/IUser'

export const userMockDb = {
  getUser: (): IUser => {
    return {
      id: 1,
      name: 'John Doe',
      email: 'john.doe@example.com',
    }
  },
}
