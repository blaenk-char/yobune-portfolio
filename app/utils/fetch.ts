/**
 * Use this function to fetch while giving a loading feedback
 *
 * @param loading The reactive loading boolean
 * @param fn The fetch function to execute
 */
export async function withLoading<T>(loading: Ref<boolean>, fn: () => Promise<T>): Promise<T> {
  loading.value = true
  return fn().finally(() => {
    loading.value = false
  })
}

/**
 * Fetch wrapper that automatically attaches the Supabase Bearer token header.
 *
 * @param url The endpoint URL to fetch
 * @param options Optional fetch configuration
 */
export async function authFetch<T>(
  url: string,
  options: Parameters<typeof $fetch>[1] = {}
): Promise<T> {
  const supabase = useSupabaseClient()
  const {
    data: { session }
  } = await supabase.auth.getSession()

  return $fetch(url, {
    ...options,
    headers: {
      ...options?.headers,
      Authorization: `Bearer ${session?.access_token}`
    }
  })
}
