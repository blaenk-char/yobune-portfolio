<script setup lang="ts">
/* Imports */
import { DialogId, WORK_CONFIG } from '#shared/constants'

/* Constants */
const { isMobile } = useDevice()
</script>

<template>
  <div class="relative grid grid-cols-1 sm:grid-cols-2 gap-5">
    <!-- Dialog -->
    <LazyUiDialog :id="DialogId.Work" />

    <!-- Timelapse -->
    <div>
      <UiTitle :title="WORK_CONFIG.timelapse.title" variant="secondary" />
      <video :src="WORK_CONFIG.timelapse.video" class="w-full rounded-xl" autoplay muted loop />
    </div>

    <!-- Quality Comparison -->
    <div>
      <UiTitle :title="WORK_CONFIG.quality.title" variant="secondary" />
      <UiComparisonSlider :image-a="WORK_CONFIG.quality.low" :image-b="WORK_CONFIG.quality.high" />
    </div>

    <!-- Work Process -->
    <div class="col-span-1 sm:col-span-2">
      <UiTitle :title="WORK_CONFIG.process.title" variant="secondary" />
      <div class="flex flex-col sm:flex-row gap-0 items-center">
        <template v-for="(item, key) in WORK_CONFIG.process.items" :key>
          <UIcon
            v-if="key > 0"
            :name="isMobile ? 'material-symbols:expand-more' : 'material-symbols:chevron-right'"
            class="shrink-0 size-20"
          />

          <div class="relative flex-1 min-w-0">
            <UiImage :src="item.image" class="w-full h-auto" />
            <div
              class="absolute bottom-0 py-1 px-3 bg-black/75 w-full rounded-b-xl text-neutral-200"
            >
              {{ item.title }}
            </div>
          </div>
        </template>
      </div>
    </div>
  </div>
</template>
