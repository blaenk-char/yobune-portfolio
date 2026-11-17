import type { NavigationMenuItem } from '@nuxt/ui'
import { PAGES } from './pages'
import { SOCIALS } from './socials'
import { UI_TEXT } from './uiText'

export const APP_NAVIGATION: NavigationMenuItem[] = [
  {
    label: UI_TEXT.commissions,
    to: PAGES.commissions.url
  },
  {
    label: UI_TEXT.shop,
    to: PAGES.shop.url
  }
]

export const USER_NAVIGATION: NavigationMenuItem[] = [
  {
    label: UI_TEXT.myCommissions,
    to: PAGES.orders.url
  },
  {
    label: UI_TEXT.profile,
    to: PAGES.profile.url
  }
]

export const GUEST_NAVIGATION: NavigationMenuItem[] = [
  {
    label: `${UI_TEXT.login} / ${UI_TEXT.register}`,
    to: PAGES.auth.url
  }
]

export const ADMIN_NAVIGATION: NavigationMenuItem[] = [
  {
    label: UI_TEXT.adminDashboard,
    to: PAGES.admin.url
  }
]

export const HEADER_NAVIGATION: NavigationMenuItem[][] = [APP_NAVIGATION, SOCIALS]
