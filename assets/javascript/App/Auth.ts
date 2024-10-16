import { User } from 'Types/User'
import { Role } from 'Types/Role'
import { Permission } from '~/@types/Permission'

export type AuthProps = {
  user: User
}

export type PermissionManager = {
  granted: (permissionKey: string) => boolean
  grant: (permissionKey: string) => Promise<boolean>
}

/**
 * Auth class
 * 
 * used to get authentication user data
 */
export class Auth {
  /**
   * @var AuthProps
   * 
   * authentication user data
   * 
   */
  private readonly props: Partial<AuthProps> = {}

  /**
   * 
   * @param props 
   */
  public readonly permission: PermissionManager = {
    granted: (permissionKey): boolean => {
      if (this.authenticated) {
        const userPermissions = this.user?.role.permissions
        const permissionFinder = (permission: Permission) => (
          permission.key === permissionKey
        )

        if (userPermissions) {
          return Boolean(userPermissions.find(permissionFinder))
        }
      }

      return false
    },

    grant: async (permissionKey): Promise<boolean> => {
      return true
    },
  }

  constructor(props?: AuthProps) {
    if (props) {
      this.props = props
    }
  }

  printUser = () => {
    console.log(this.props.user)
  }

  get authenticated(): boolean {
    return typeof this.props.user === 'object'
  }

  get user(): (User | undefined) {
    return this.props.user
  }

  get role(): (Role | undefined) {
    return this.props.user?.role
  }

  get permissions(): Array<Permission> {
    if (this.authenticated && this.props.user?.role) {
      return this.props.user.role.permissions
    }

    return []
  }
}
