<script setup lang="ts">
/* Props */
withDefaults(
  defineProps<{
    src: string
    loading?: 'lazy' | 'eager'
  }>(),
  {
    alt: 'Artwork',
    loading: 'lazy'
  }
)

/* Constants */
const { open } = useLightbox()
</script>

<template>
  <img
    :src="src"
    :loading="loading"
    draggable="false"
    class="cursor-pointer rounded-xl"
    @click="open(src)"
  />
</template>
