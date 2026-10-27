<script setup lang="ts">
/* Props */
const props = defineProps<{
  items: string[]
}>()

/* Constants */
const TRANSITION_DURATION = 500

/* Refs */
const current = ref<number>(0)
const isTransitioning = ref<boolean>(false)

/* Functions */
function getOffset(i: number) {
  let diff = i - current.value
  if (diff > props.items.length / 2) diff -= props.items.length
  if (diff < -props.items.length / 2) diff += props.items.length
  return diff
}

function slide(context: 'next' | 'prev') {
  if (isTransitioning.value) return // no slide during transition

  isTransitioning.value = true

  switch (context) {
    // prev
    case 'prev':
      current.value = (current.value - 1 + props.items.length) % props.items.length
      break
    // next
    case 'next':
      current.value = (current.value + 1) % props.items.length
      break
  }

  setTimeout(() => (isTransitioning.value = false), TRANSITION_DURATION)
}

function getStyle(i: number) {
  const offset = getOffset(i)
  const abs = Math.abs(offset)

  return {
    top: `${50 + offset * 30}%`, // centered at 50%, each step = 30%
    opacity: abs > 1 ? 0 : abs === 1 ? 0.45 : 1,
    zIndex: 10 - abs * 5,
    // scale: abs === 0 ? '1' : '0.85',
    pointerEvents: abs === 0 ? 'auto' : 'none',
    transitionDuration: `${TRANSITION_DURATION}ms`
  }
}
</script>

<template>
  <div class="grid grid-cols-1 sm:grid-cols-[40px_1fr_40px] items-center gap-4">
    <!-- Prev Button -->
    <UButton
      icon="i-lucide-chevron-up"
      size="xl"
      data-testid="btn-prev"
      class="justify-center"
      @click="slide('prev')"
    />

    <div class="relative h-60 sm:h-68 md:h-88 lg:h-96 xl:h-108 flex-1 overflow-hidden rounded-xl">
      <UiImage
        v-for="(image, key) in items"
        :key
        :src="image"
        data-testid="slide"
        :data-offset="getOffset(key)"
        :data-index="key"
        class="absolute w-full h-4/5 object-cover transition-all ease-in-out -translate-y-1/2"
        :style="getStyle(key)"
      />
    </div>

    <!-- Next Button -->
    <UButton
      icon="i-lucide-chevron-down"
      size="xl"
      data-testid="btn-next"
      class="justify-center"
      @click="slide('next')"
    />
  </div>
</template>
