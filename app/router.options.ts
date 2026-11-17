import type { RouterConfig } from '@nuxt/schema'

export default <RouterConfig>{
  scrollBehavior(to, _from, savedPosition) {
    if (savedPosition) return savedPosition

    if (to.hash) {
      const header = document.querySelector('header')
      return {
        el: to.hash,
        top: header?.offsetHeight || 0,
        behavior: 'smooth'
      }
    }

    return { top: 0 }
  }
}
