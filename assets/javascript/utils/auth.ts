import { axios } from '~/config/axios'
import { Auth, AuthProps } from 'App/Auth'

export async function auth(): Promise<Auth> {
  const response = await axios.get<AuthProps>('/user/auth')

  if (typeof response.data === 'object' && response.data.user) {
    return new Auth(response.data)
  }

  return new Auth
}
