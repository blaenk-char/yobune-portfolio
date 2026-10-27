<script setup lang="ts">
/* Constants */
const settingsStore = useSettingsStore()

/* Refs */
const mousePosition = ref<{
  x: number
  y: number
}>()
const mouseState = ref<'idle' | 'click' | 'move'>('idle')
const timer = ref()

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
// eslint-disable-next-line @typescript-eslint/no-unused-vars
let rafId: number

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

function drawLoop() {
  if (!ctx || !canvas.value) return
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

/* Lifecycle Hooks */
onMounted(() => {
  // canvas setup
  if (canvas.value) {
    ctx = canvas.value.getContext('2d')
    resizeCanvas()
    window.addEventListener('resize', resizeCanvas)
    drawLoop()
  }

  // mouse events
  window.addEventListener('mousemove', (event: MouseEvent) => {
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

  window.addEventListener('mousedown', () => {
    mouseState.value = 'click'
  })
  window.addEventListener('mouseup', () => {
    mouseState.value = 'idle'
  })
})
</script>

<template>
  <Teleport to="body">
    <canvas
      v-if="settingsStore.cursor && settingsStore.showCursor"
      ref="canvas"
      class="fixed inset-0 z-9998 pointer-events-none"
    />
    <img
      v-if="settingsStore.cursor && settingsStore.showCursor && mousePosition"
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
