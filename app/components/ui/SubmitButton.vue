<script setup lang="ts">
/* Props */
defineProps<{
  label: string
  loading?: boolean
}>()
</script>

<template>
  <div class="flex justify-center">
    <UButton type="submit" :label block :loading class="w-1/2 mt-3" />
  </div>
</template>
