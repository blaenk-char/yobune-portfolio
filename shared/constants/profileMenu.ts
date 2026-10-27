import type { NavigationMenuItem } from '@nuxt/ui'
import { UI_TEXT } from './uiText'

export const PROFILE_SECTIONS = {
  username: 'username',
  email: 'email',
  password: 'password',
  logout: 'logout'
}

export const PROFILE_MENU: NavigationMenuItem[] = [
  {
    id: PROFILE_SECTIONS.username,
    label: UI_TEXT.username,
    to: '/profile#username',
    target: '_self',
    active: false
  },
  {
    id: PROFILE_SECTIONS.email,
    label: UI_TEXT.email,
    to: '/profile#email',
    target: '_self',
    active: false
  },
  {
    id: PROFILE_SECTIONS.password,
    label: UI_TEXT.password,
    to: '/profile#password',
    target: '_self',
    active: false
  },
  {
    id: PROFILE_SECTIONS.logout,
    label: UI_TEXT.logout,
    to: '/profile#logout',
    target: '_self',
    active: false
  }
]
