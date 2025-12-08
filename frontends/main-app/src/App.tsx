import {WuPrimaryNavbar} from '@npm-questionpro/wick-ui-lib'
import './App.css'
import {API_BASE_URL} from './constants/appConstants'
import type {IServerResponse} from './types/IServerResponse'
import type {IUser} from './types/IUser'
import {useQuery, type UseQueryResult} from '@tanstack/react-query'
import {AppRoutes} from './AppRoutes'

const fetchUser = async (): Promise<IServerResponse<IUser>> => {
  return fetch(`${API_BASE_URL}user`, {
    method: 'GET',
    headers: {
      // eslint-disable-next-line @typescript-eslint/naming-convention
      'Content-Type': 'application/json',
    },
  }).then(response => {
    if (!response.ok) {
      throw new Error('Network response was not ok')
    }
    return response.json() as Promise<IServerResponse<IUser>>
  })
}

const useUserApi = (): UseQueryResult<IServerResponse<IUser>, Error> => {
  return useQuery({
    queryKey: ['user'],
    queryFn: fetchUser,
  })
}

export const App: React.FC = () => {
  const {data, error, isLoading} = useUserApi()

  if (isLoading) {
    return <div>Loading...</div>
  }

  if (error) {
    console.error('Error fetching user:', error)
    return <div>Error: {error?.message || 'Something went wrong'}</div>
  }
  const user = data?.data
  if (!user) {
    throw new Error('User not found')
  }

  return (
    <>
      <div>
        <WuPrimaryNavbar
          Links={[
            <a key="home" href="#" className="active">
              Home
            </a>,
            <a key="about" href="#">
              About
            </a>,
            <a key="services" href="#">
              Services
            </a>,
            <a key="contact" href="#">
              Contact
            </a>,
          ]}
        />
        <AppRoutes />
      </div>
    </>
  )
}
