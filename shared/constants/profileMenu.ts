import type { NavigationMenuItem } from '@nuxt/ui'
import { PAGES } from './pages'
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
    to: `${PAGES.profile.url}#${PROFILE_SECTIONS.username}`,
    target: '_self',
    active: false
  },
  {
    id: PROFILE_SECTIONS.email,
    label: UI_TEXT.email,
    to: `${PAGES.profile.url}#${PROFILE_SECTIONS.email}`,
    target: '_self',
    active: false
  },
  {
    id: PROFILE_SECTIONS.password,
    label: UI_TEXT.password,
    to: `${PAGES.profile.url}#${PROFILE_SECTIONS.password}`,
    target: '_self',
    active: false
  },
  {
    id: PROFILE_SECTIONS.logout,
    label: UI_TEXT.logout,
    to: `${PAGES.profile.url}#${PROFILE_SECTIONS.logout}`,
    target: '_self',
    active: false
  }
]
