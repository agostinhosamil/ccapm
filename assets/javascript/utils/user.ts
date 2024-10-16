import { User } from 'Types/User'

export const user = <KeyType extends (keyof User) = any>(prop: KeyType): User[KeyType] => {
  const user = {
    id: 1
  } as User

  return user[prop]
}
