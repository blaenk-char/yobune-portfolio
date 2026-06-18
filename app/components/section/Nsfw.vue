<script setup lang="ts">
/* Imports */
import { DialogId, NSFW_CONFIG, NSFW_IMAGES } from '#shared/constants'

/* Constants */
const settingsStore = useSettingsStore()
const { isMobile } = useDevice()

/* Refs */
const galleryRef = useTemplateRef('gallery')

/* Functions */
function scroll(direction: 'left' | 'right') {
  galleryRef.value?.scrollBy({ left: direction === 'left' ? -400 : 400, behavior: 'smooth' })
}
</script>

<template>
  <div class="relative">
    <!-- Dialog -->
    <LazyUiDialog :id="DialogId.Nsfw" />

    <!-- Reveal -->
    <Transition name="fade">
      <div
        v-if="!settingsStore.nsfw"
        class="absolute inset-0 z-10 flex flex-col items-center justify-center gap-3"
      >
        <UIcon name="i-lucide-lock" class="size-10 text-white/80" />
        <p class="text-white/70 font-medium">{{ NSFW_CONFIG.blocked }}</p>
        <UButton
          :label="NSFW_CONFIG.reveal"
          variant="subtle"
          color="neutral"
          @click="settingsStore.nsfw = true"
        />
      </div>
    </Transition>

    <!-- Nsfw Gallery -->
    <div ref="gallery" class="relative flex gap-4 overflow-x-auto h-96 rounded-xl">
      <UiImage
        v-for="(image, key) in NSFW_IMAGES"
        :key
        :src="image"
        class="transition"
        :class="{ 'blur-2xl': !settingsStore.nsfw }"
      />

      <!-- Nav Buttons -->
      <template v-if="!isMobile && settingsStore.nsfw">
        <UButton
          icon="i-lucide-chevron-left"
          size="xl"
          class="fixed top-1/2 -translate-y-1/2 left-5 justify-center rounded-full"
          @click="scroll('left')"
        />
        <UButton
          icon="i-lucide-chevron-right"
          size="xl"
          class="fixed top-1/2 -translate-y-1/2 right-5 justify-center rounded-full"
          @click="scroll('right')"
        />
      </template>
    </div>
  </div>
</template>
