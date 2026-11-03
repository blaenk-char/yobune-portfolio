import { ERROR_MESSAGE, UI_TEXT } from '#shared/constants'

/**
 * Add a toast with prepared params
 *
 * @param message The description to show under the title
 * @param type If it's a success or error message
 */
export function addToast(message: string | undefined, type: 'success' | 'error') {
  const toast = useToast()
  const isSuccess = type === 'success'

  toast.add({
    title: isSuccess ? UI_TEXT.success : UI_TEXT.error,
    description: message || ERROR_MESSAGE.server,
    color: type
  })
}
