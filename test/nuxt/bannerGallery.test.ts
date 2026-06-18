import { mountSuspended } from '@nuxt/test-utils/runtime'
import { createPinia, setActivePinia } from 'pinia'
import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest'
import SectionBanner from '~/components/section/Banner.vue'
import { BANNERS } from '#shared/constants'

describe('SectionBanner', () => {
  beforeEach(() => {
    setActivePinia(createPinia())
    vi.useFakeTimers()
  })

  afterEach(() => {
    vi.useRealTimers()
  })

  it('renders the component', async () => {
    const wrapper = await mountSuspended(SectionBanner)
    expect(wrapper.exists()).toBe(true)
  })

  it('renders the correct number of slides', async () => {
    const wrapper = await mountSuspended(SectionBanner)
    const slides = wrapper.findAll('[data-testid="slide"]')
    expect(slides.length).toBe(BANNERS.length)
  })

  it('first slide starts with offset 0', async () => {
    const wrapper = await mountSuspended(SectionBanner)
    const active = wrapper.find('[data-testid="slide"][data-offset="0"]')
    expect(active.exists()).toBe(true)
  })

  it('clicking next sets next slide to active', async () => {
    const wrapper = await mountSuspended(SectionBanner)
    const nextBtn = wrapper.find('[data-testid="btn-next"]')
    await nextBtn.trigger('click')
    const active = wrapper.find('[data-testid="slide"][data-offset="0"]')
    expect(active.attributes('data-index')).toBe('1')
  })

  it('clicking prev sets last slide to active ', async () => {
    const wrapper = await mountSuspended(SectionBanner)
    const prevBtn = wrapper.find('[data-testid="btn-prev"]')
    await prevBtn.trigger('click')
    const active = wrapper.find('[data-testid="slide"][data-offset="0"]')
    expect(active.attributes('data-index')).toBe(String(BANNERS.length - 1))
  })

  it('clicking next then prev returns to the first slide', async () => {
    const wrapper = await mountSuspended(SectionBanner)
    await wrapper.find('[data-testid="btn-next"]').trigger('click')

    vi.advanceTimersByTime(1000)
    await nextTick()
    await wrapper.find('[data-testid="btn-prev"]').trigger('click')

    const active = wrapper.find('[data-testid="slide"][data-offset="0"]')
    expect(active.attributes('data-index')).toBe('0')
  })

  it('only one slide has offset 0 at any time', async () => {
    const wrapper = await mountSuspended(SectionBanner)
    await wrapper.find('[data-testid="btn-next"]').trigger('click')
    const actives = wrapper.findAll('[data-testid="slide"][data-offset="0"]')
    expect(actives.length).toBe(1)
  })
})
