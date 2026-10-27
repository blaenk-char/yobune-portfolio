import { breakpointsTailwind, useBreakpoints } from '@vueuse/core'

/**
 * Use breakpoints to find out what device the user is using.
 */
export const useDevice = () => {
  const breakpoints = useBreakpoints(breakpointsTailwind)
  const hydrated = ref(false)

  onNuxtReady(() => {
    hydrated.value = true
  })

  const isMobile = computed(() => hydrated.value && breakpoints.smaller('sm').value)
  const isTablet = computed(() => hydrated.value && breakpoints.between('sm', 'lg').value)
  const isDesktop = computed(() => (hydrated.value ? breakpoints.greaterOrEqual('lg').value : true))

  return {
    isMobile,
    isTablet,
    isDesktop
  }
}
