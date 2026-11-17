import { DIALOG_CONFIG, DIALOGS, DialogId, NSFW_IMAGES, PAGES, UI_TEXT } from '#shared/constants'
import { mountSuspended } from '@nuxt/test-utils/runtime'
import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest'
import SectionNsfw from '~/components/section/Nsfw.vue'
import UiComparisonSlider from '~/components/ui/ComparisonSlider.vue'
import UiDialog from '~/components/ui/Dialog.vue'
import UiImage from '~/components/ui/Image.vue'
import UiMasonryGrid from '~/components/ui/MasonryGrid.vue'
import UiPreviewGallery from '~/components/ui/PreviewGallery.vue'
import UiSubmitButton from '~/components/ui/SubmitButton.vue'
import UiTitle from '~/components/ui/Title.vue'
import UiVerticalGallery from '~/components/ui/VerticalGallery.vue'

describe('UI & Section Components', () => {
  beforeEach(async () => {
    await navigateTo(PAGES.home.url)
    useLightbox().close()
    useSettingsStore().nsfw = false
    useDialogStore().stop()
  })

  afterEach(() => {
    vi.useRealTimers()
  })

  describe('UiTitle & UiSubmitButton', () => {
    it('renders primary title with separator and optional id, and secondary title without separator', async () => {
      const primary = await mountSuspended(UiTitle, {
        props: { title: 'Animated Banners', variant: 'primary', id: 'banners' }
      })
      expect(primary.text()).toContain('Animated Banners')
      expect(primary.attributes('id')).toBe('banners')
      expect(primary.classes()).toContain('mt-20')
      expect(primary.find('[role="separator"]').exists()).toBe(true)

      const secondary = await mountSuspended(UiTitle, {
        props: { title: 'Sub Section', variant: 'secondary' }
      })
      expect(secondary.classes()).toContain('ml-2')
      expect(secondary.find('[role="separator"]').exists()).toBe(false)
    })

    it('renders submit button with type="submit" and label', async () => {
      const wrapper = await mountSuspended(UiSubmitButton, {
        props: { label: 'Save Changes' }
      })
      const btn = wrapper.find('button[type="submit"]')
      expect(btn.exists()).toBe(true)
      expect(btn.text()).toContain('Save Changes')
    })
  })

  describe('UiImage', () => {
    it('renders lazy-loaded image and opens lightbox with src on click', async () => {
      const lightbox = useLightbox()
      const wrapper = await mountSuspended(UiImage, {
        props: { src: '/artwork/sample.webp' }
      })

      const img = wrapper.find('img')
      expect(img.attributes('src')).toBe('/artwork/sample.webp')
      expect(img.attributes('loading')).toBe('lazy')

      await img.trigger('click')
      expect(lightbox.isOpen.value).toBe(true)
      expect(lightbox.image.value).toBe('/artwork/sample.webp')
    })
  })

  describe('UiVerticalGallery', () => {
    const items = ['/b1.webp', '/b2.webp', '/b3.webp']

    it('slides next/prev, wraps around, and locks input during transition', async () => {
      vi.useFakeTimers()
      const wrapper = await mountSuspended(UiVerticalGallery, {
        props: { items }
      })

      const getActiveIndex = () =>
        wrapper
          .findAll('[data-testid="slide"]')
          .find((el) => el.attributes('data-offset') === '0')
          ?.attributes('data-index')

      expect(getActiveIndex()).toBe('0')

      await wrapper.find('[data-testid="btn-next"]').trigger('click')
      expect(getActiveIndex()).toBe('1')

      // Locked during 500ms transition
      await wrapper.find('[data-testid="btn-next"]').trigger('click')
      expect(getActiveIndex()).toBe('1')

      vi.advanceTimersByTime(500)
      await wrapper.find('[data-testid="btn-prev"]').trigger('click')
      expect(getActiveIndex()).toBe('0')

      vi.advanceTimersByTime(500)
      await wrapper.find('[data-testid="btn-prev"]').trigger('click')
      expect(getActiveIndex()).toBe('2')
    })
  })

  describe('UiComparisonSlider', () => {
    it('initializes at 50% and updates/clamps divider position on mouse drag', async () => {
      const wrapper = await mountSuspended(UiComparisonSlider, {
        props: { imageA: '/low.webp', imageB: '/high.webp' }
      })

      const container = wrapper.find('[data-testid="container"]')
      const divider = wrapper.find('[data-testid="divider"]')
      const overlay = wrapper.find('[data-testid="overlay"]')

      expect(divider.attributes('style')).toContain('left: 50%')
      expect(overlay.attributes('style')).toContain('inset(0 50% 0 0)')

      vi.spyOn(container.element, 'getBoundingClientRect').mockReturnValue({
        left: 0,
        top: 0,
        width: 200,
        height: 100,
        right: 200,
        bottom: 100,
        x: 0,
        y: 0,
        toJSON: () => ({})
      })

      await container.trigger('mousedown', { clientX: 50 })
      expect(divider.attributes('style')).toContain('left: 25%')

      // Drag past right edge -> clamps to 100%
      window.dispatchEvent(new MouseEvent('mousemove', { clientX: 300 }))
      await nextTick()
      expect(divider.attributes('style')).toContain('left: 100%')

      // Release mouse -> stops tracking
      window.dispatchEvent(new MouseEvent('mouseup'))
      window.dispatchEvent(new MouseEvent('mousemove', { clientX: 20 }))
      await nextTick()
      expect(divider.attributes('style')).toContain('left: 100%')
    })
  })

  describe('UiPreviewGallery & UiMasonryGrid', () => {
    it('switches big preview image when clicking a thumbnail in UiPreviewGallery', async () => {
      const sheets = ['/s1.webp', '/s2.webp', '/s3.webp']
      const wrapper = await mountSuspended(UiPreviewGallery, {
        props: { items: sheets }
      })

      expect(wrapper.find('img').attributes('src')).toBe('/s1.webp')

      const thumbs = wrapper.findAll('.grid img')
      await thumbs[2]!.element.parentElement!.click()
      await nextTick()

      expect(wrapper.find('img').attributes('src')).toBe('/s3.webp')
    })

    it('renders all items and responsive column classes in UiMasonryGrid', async () => {
      const items = ['/m1.webp', '/m2.webp', '/m3.webp', '/m4.webp']
      const wrapper = await mountSuspended(UiMasonryGrid, {
        props: { items, columns: 3 }
      })

      expect(wrapper.classes()).toContain('sm:columns-2')
      expect(wrapper.classes()).toContain('lg:columns-3')
      expect(wrapper.classes()).not.toContain('xl:columns-4')
      expect(wrapper.findAll('img').length).toBe(4)
    })
  })

  describe('UiDialog', () => {
    it('stays hidden when inactive and immediately types scene text when mounted active', async () => {
      vi.useFakeTimers()
      const dialogStore = useDialogStore()

      // Inactive initially
      const inactiveWrapper = await mountSuspended(UiDialog, {
        props: { id: DialogId.Intro }
      })
      expect(inactiveWrapper.find(`#${DialogId.Intro}`).exists()).toBe(false)

      // Activate Intro scene BEFORE mounting -> { immediate: true } watcher must start typing
      dialogStore.dialogIndex = 0
      const activeWrapper = await mountSuspended(UiDialog, {
        props: { id: DialogId.Intro }
      })

      expect(activeWrapper.find(`#${DialogId.Intro}`).exists()).toBe(true)
      expect(dialogStore.isTyping).toBe(true)

      const introText = DIALOGS[0]!.dialog
      vi.advanceTimersByTime(DIALOG_CONFIG.speed * (introText.length + 1))
      await nextTick()

      expect(activeWrapper.text()).toContain(introText)
      expect(dialogStore.isTyping).toBe(false)
      expect(activeWrapper.text()).toContain(DIALOG_CONFIG.disableActionLabel)
    })
  })

  describe('SectionNsfw', () => {
    it('blurs NSFW images until the Reveal button is clicked', async () => {
      const settingsStore = useSettingsStore()
      const wrapper = await mountSuspended(SectionNsfw)

      expect(wrapper.text()).toContain(UI_TEXT.nsfwBlocked)
      const images = wrapper.findAll('img')
      expect(images.length).toBe(NSFW_IMAGES.length)
      expect(images[0]!.classes()).toContain('blur-2xl')

      const revealBtn = wrapper.findAll('button').find((b) => b.text().includes(UI_TEXT.nsfwReveal))
      expect(revealBtn).toBeDefined()
      await revealBtn!.trigger('click')
      await nextTick()

      expect(settingsStore.nsfw).toBe(true)
      expect(wrapper.findAll('img')[0]!.classes()).not.toContain('blur-2xl')
    })
  })
})
