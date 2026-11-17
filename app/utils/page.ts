/**
 * Checks if the current route path is inside the array of allowed pages.
 *
 * @param pages Allowed page URLs
 */
export function isPageAllowed(pages: string[]): boolean {
  const route = useRoute()
  return pages.includes(route.path)
}
