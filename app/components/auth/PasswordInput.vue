<script setup lang="ts">
/* Refs */
const show = ref(false)
</script>

<template>
  <UInput :type="show ? 'text' : 'password'">
    <!-- Show Password Icon -->
    <template #trailing>
      <UButton
        color="neutral"
        variant="link"
        size="sm"
        :icon="show ? 'i-lucide-eye-off' : 'i-lucide-eye'"
        @click="show = !show"
      />
    </template>
  </UInput>
</template>
