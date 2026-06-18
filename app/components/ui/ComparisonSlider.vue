<script setup lang="ts">
/* Props */
defineProps({
  imageA: { type: String, required: true },
  imageB: { type: String, required: true }
})

/* Refs */
const pos = ref<number>(50)
const dragging = ref<boolean>(false)
const containerRef = useTemplateRef('container')

/* Functions */
function calcPos(clientX: number) {
  if (!containerRef.value) return 0

  const rect = containerRef.value?.getBoundingClientRect()
  return Math.min(Math.max(((clientX - rect.left) / rect.width) * 100, 0), 100)
}

function startDrag(event: MouseEvent) {
  dragging.value = true
  pos.value = calcPos(event.clientX)
}

function startDragTouch(event: TouchEvent) {
  dragging.value = true
  pos.value = calcPos(event.touches[0]!.clientX)
}

function onMove(event: MouseEvent) {
  if (dragging.value) pos.value = calcPos(event.clientX)
}

function onMoveTouch(event: TouchEvent) {
  if (dragging.value) pos.value = calcPos(event.touches[0]!.clientX)
}

function stopDrag() {
  dragging.value = false
}

onMounted(() => {
  window.addEventListener('mousemove', onMove)
  window.addEventListener('touchmove', onMoveTouch, { passive: true })
  window.addEventListener('mouseup', stopDrag)
  window.addEventListener('touchend', stopDrag)
})
</script>

<template>
  <div
    ref="container"
    class="relative w-full overflow-hidden rounded-xl cursor-col-resize select-none"
    style="aspect-ratio: 16/9"
    data-testid="container"
    @mousedown="startDrag"
    @touchstart.passive="startDragTouch"
  >
    <!-- Base Image (Right) -->
    <img :src="imageB" draggable="false" class="absolute inset-0 w-full h-full object-cover" />

    <!-- Overlay Image (Left) -->
    <img
      :src="imageA"
      draggable="false"
      class="absolute inset-0 w-full h-full object-cover"
      :style="{ clipPath: `inset(0 ${100 - pos}% 0 0)` }"
      data-testid="overlay"
    />

    <!-- Divider & Handle -->
    <div
      class="absolute top-0 bottom-0 w-0.5 bg-white -translate-x-1/2 pointer-events-none"
      :style="{ left: pos + '%' }"
      data-testid="divider"
    >
      <div
        class="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-10 h-10 rounded-full bg-white flex items-center justify-center"
      >
        <svg width="20" height="20" viewBox="0 0 20 20" fill="none">
          <path
            d="M7 4L3 10L7 16M13 4L17 10L13 16"
            stroke="#333"
            stroke-width="1.5"
            stroke-linecap="round"
            stroke-linejoin="round"
          />
        </svg>
      </div>
    </div>
  </div>
</template>
