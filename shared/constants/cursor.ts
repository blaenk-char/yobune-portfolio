import { PAGES } from './pages'

type CursorConfig = {
  className: string
  storageKey: string
  default: boolean
  trueLabel: string
  falseLabel: string
  pages: string[]
}

export const CURSOR_CONFIG: CursorConfig = {
  className: 'fancy-cursor', // class set on document
  storageKey: 'blaenk-fancy-cursor', // key for cookie
  default: true,
  trueLabel: 'Cursor: Fancy',
  falseLabel: 'Cursor: Boring',
  pages: [PAGES.home.url]
}
