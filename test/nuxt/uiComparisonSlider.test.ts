import { mountSuspended } from '@nuxt/test-utils/runtime'
import { describe, expect, it, vi } from 'vitest'
import { WORK_CONFIG } from '#shared/constants'
import ComparisonSlider from '~/components/ui/ComparisonSlider.vue'

const PROPS = {
  imageA: WORK_CONFIG.quality.low,
  imageB: WORK_CONFIG.quality.high
}

describe('ComparisonSlider', async () => {
  it('renders the component', async () => {
    const wrapper = await mountSuspended(ComparisonSlider, { props: PROPS })
    expect(wrapper.exists()).toBe(true)
  })

  it('renders both images', async () => {
    const wrapper = await mountSuspended(ComparisonSlider, { props: PROPS })
    const imgs = wrapper.findAll('img')
    const srcs = imgs.map((i) => i.attributes('src'))
    expect(srcs).toContain(PROPS.imageA)
    expect(srcs).toContain(PROPS.imageB)
  })

  it('divider starts at 50%', async () => {
    const wrapper = await mountSuspended(ComparisonSlider, { props: PROPS })
    const divider = wrapper.find('[data-testid="divider"]')
    expect(divider.attributes('style')).toContain('left: 50%')
  })

  it('overlay image starts clipped at 50%', async () => {
    const wrapper = await mountSuspended(ComparisonSlider, { props: PROPS })
    const overlay = wrapper.find('[data-testid="overlay"]')
    expect(overlay.attributes('style')).toContain('inset(0 50% 0 0)')
  })

  it('mousedown on the container sets dragging and updates position', async () => {
    const wrapper = await mountSuspended(ComparisonSlider, { props: PROPS })
    const container = wrapper.find('[data-testid="container"]')

    // getBoundingClientRect is not available in happy-dom so we mock it
    vi.spyOn(container.element, 'getBoundingClientRect').mockReturnValue({
      left: 0,
      width: 400,
      top: 0,
      height: 0,
      right: 400,
      bottom: 0,
      x: 0,
      y: 0,
      toJSON: () => {}
    } as DOMRect)

    await container.trigger('mousedown', { clientX: 100 })

    const divider = wrapper.find('[data-testid="divider"]')
    expect(divider.attributes('style')).toContain('left: 25%')
  })
})
