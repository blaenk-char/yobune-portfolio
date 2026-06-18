<script setup lang="ts">
/* Imports */
import { UI_TEXT } from '#shared/constants'

/* Page */
definePageMeta({
  layout: 'public'
})
</script>

<template>
  <UCard class="max-w-xl mx-auto mt-[10vh]">
    <template #title>
      {{ UI_TEXT.title_confirm }}
    </template>

    <AuthConfirmForm />
  </UCard>
</template>
