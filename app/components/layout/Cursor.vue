<script setup lang="ts">
/* Constants */
const settingsStore = useSettingsStore()

/* Refs */
const mousePosition = ref<{
  x: number
  y: number
}>()
const mouseState = ref<'idle' | 'click' | 'move'>('idle')
const timer = ref<ReturnType<typeof setTimeout>>()

/* Computeds */
const isActive = computed(() => settingsStore.cursor && settingsStore.showCursor)

/* Trail */
const canvas = ref<HTMLCanvasElement>()
let ctx: CanvasRenderingContext2D | null = null
let particles: {
  x: number
  y: number
  hue: number
  alpha: number
  size: number
}[] = []
let hue = 0
let rafId: number | null = null

/* Functions */
function resizeCanvas() {
  if (!canvas.value) return
  canvas.value.width = window.innerWidth
  canvas.value.height = window.innerHeight
}

function spawnParticle(x: number, y: number) {
  particles.push({ x, y, hue, alpha: 1, size: 10 })
  hue = (hue + 8) % 360
}

function stopLoop() {
  if (rafId !== null) {
    cancelAnimationFrame(rafId)
    rafId = null
  }
}

function drawLoop() {
  if (!ctx || !canvas.value || !isActive.value) {
    rafId = null
    return
  }
  ctx.clearRect(0, 0, canvas.value.width, canvas.value.height)

  particles = particles.filter((p) => p.alpha > 0.01)

  for (const p of particles) {
    ctx.beginPath()
    ctx.arc(p.x, p.y, p.size, 0, Math.PI * 2)
    ctx.fillStyle = `hsla(${p.hue}, 100%, 65%, ${p.alpha})`
    ctx.fill()
    p.alpha -= 0.035
    p.size *= 0.97
  }

  rafId = requestAnimationFrame(drawLoop)
}

function setupCanvas() {
  if (!canvas.value) return
  ctx = canvas.value.getContext('2d')
  resizeCanvas()
  stopLoop()
  drawLoop()
}

/* Watches */
watch(canvas, (el) => {
  if (el) {
    setupCanvas()
  } else {
    stopLoop()
    ctx = null
    particles = []
  }
})

/* Event Listeners */
useEventListener('resize', resizeCanvas)
useEventListener('mousemove', (event: MouseEvent) => {
  if (!isActive.value) return
  if (Math.abs(event.movementX) > 1 || Math.abs(event.movementY) > 1) {
    mouseState.value = 'move'
    spawnParticle(event.clientX, event.clientY)
  }
  mousePosition.value = { x: event.clientX, y: event.clientY }
  clearTimeout(timer.value)
  timer.value = setTimeout(() => {
    mouseState.value = 'idle'
  }, 50)
})
useEventListener('mousedown', () => {
  if (isActive.value) mouseState.value = 'click'
})
useEventListener('mouseup', () => {
  if (isActive.value) mouseState.value = 'idle'
})

/* Lifecycle Hooks */
onBeforeUnmount(() => {
  stopLoop()
  clearTimeout(timer.value)
})
</script>

<template>
  <Teleport to="body">
    <canvas v-if="isActive" ref="canvas" class="fixed inset-0 z-9998 pointer-events-none" />
    <img
      v-if="isActive && mousePosition"
      :src="`/cursors/${mouseState}.ico`"
      class="fixed z-9999 pointer-events-none -translate-y-1/2 -translate-x-1/2"
      :draggable="false"
      :style="{
        left: `${mousePosition?.x}px`,
        top: `${mousePosition?.y}px`
      }"
    />
  </Teleport>
</template>
