import { DIALOG_CONFIG } from '#shared/constants'

/**
 * Displays text in typewriter style.
 *
 * @param text Text to display
 */
export function useTypewriter(text: Ref<string>) {
  const output = ref('')

  let i = 0
  let interval: ReturnType<typeof setInterval> | null = null

  function stop() {
    if (interval) {
      clearInterval(interval)
      interval = null
    }
  }

  function start(onDone?: () => void) {
    if (!import.meta.client) return
    stop()
    output.value = ''
    i = 0

    interval = setInterval(() => {
      output.value += text.value[i]
      i++
      if (i >= text.value.length) {
        stop()
        onDone?.()
      }
    }, DIALOG_CONFIG.speed)
  }

  onBeforeUnmount(stop)

  return { output, start, stop }
}
