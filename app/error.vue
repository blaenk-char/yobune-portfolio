<script setup lang="ts">
/* Imports */
import type { NuxtError } from '#app'

/* Props */
defineProps<{
  error: NuxtError
}>()
</script>

<template>
  <UApp>
    <NuxtLayout name="public">
      <LayoutCursor />
      <UError :error :clear="{ size: 'xl' }" />
    </NuxtLayout>
  </UApp>
</template>
