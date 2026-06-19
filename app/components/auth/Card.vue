<script setup lang="ts">
/* Props */
defineProps<{
  title?: string
}>()
</script>

<template>
  <UCard class="max-w-xl mx-auto mt-[10vh]">
    <template v-if="title" #title>
      {{ title }}
    </template>

    <slot></slot>
  </UCard>
</template>
