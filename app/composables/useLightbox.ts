/**
 * Handle the lightbox modal for viewing images.
 */
export const useLightbox = () => {
  const isOpen = useState('lightbox-open', () => false)
  const image = useState('lightbox-image', () => '')

  const open = (src: string) => {
    image.value = src
    isOpen.value = true
  }

  const close = () => {
    isOpen.value = false
    image.value = ''
  }

  return { isOpen, image, open, close }
}
