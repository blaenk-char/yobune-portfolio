import { UI_TEXT } from '#shared/constants/uiText'
import type { NavigationMenuItem } from '@nuxt/ui'

export const PROFILE_MENU: NavigationMenuItem[] = [
  {
    id: 'username',
    label: UI_TEXT.username,
    to: '/profile#username',
    target: '_self',
    active: false
  },
  {
    id: 'email',
    label: UI_TEXT.email,
    to: '/profile#email',
    target: '_self',
    active: false
  },
  {
    id: 'password',
    label: UI_TEXT.password,
    to: '/profile#password',
    target: '_self',
    active: false
  },
  {
    id: 'logout',
    label: UI_TEXT.logout,
    to: '/profile#logout',
    target: '_self',
    active: false
  }
]
