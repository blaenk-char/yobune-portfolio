<script setup lang="ts">
/* Imports */
import { PROFILE_MENU } from '~~/shared/constants'

/* Page */
definePageMeta({
  layout: 'public',
  middleware: 'auth'
})
</script>

<template>
  <UPage>
    <!-- List Aside -->
    <template #left>
      <UPageAside>
        <UNavigationMenu :items="PROFILE_MENU" orientation="vertical" />
      </UPageAside>
    </template>
  </UPage>
</template>
