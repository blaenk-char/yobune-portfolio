<script setup lang="ts">
/* Imports */
import { UI_TEXT } from '#shared/constants'

/* Props */
defineProps<{
  items: string[]
  columns: 1 | 2 | 3 | 4
}>()

/* Constants */
const { isMobile } = useDevice()

/* Refs */
const showMore = ref<boolean>(false)
</script>

<template>
  <div
    class="gap-2"
    :class="{
      'columns-1': true,
      'sm:columns-2': columns >= 2,
      'lg:columns-3': columns >= 3,
      'xl:columns-4': columns >= 4
    }"
  >
    <!-- Grid -->
    <div v-for="(item, key) in items" :key class="mb-2">
      <UiImage v-if="!isMobile || showMore || key < 3" :src="item" />
    </div>

    <!-- Show More -->
    <UButton
      v-if="isMobile"
      :label="showMore ? UI_TEXT.showLess : UI_TEXT.showMore"
      size="xl"
      class="justify-center w-full"
      @click="showMore = !showMore"
    />
  </div>
</template>
