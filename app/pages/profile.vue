<script setup lang="ts">
/* Imports */
import { PROFILE_MENU } from '~~/shared/constants'

/* Page */
definePageMeta({
  layout: 'public',
  middleware: 'auth'
})

/* Constants */
const sections: Record<string, Component> = {
  profile: () => undefined,
  security: () => undefined,
  notifications: () => undefined
}
</script>

<template>
  <UPage>
    <!-- List Aside -->
    <template #left>
      <UPageAside>
        <UNavigationMenu :items="PROFILE_MENU" orientation="vertical" />
      </UPageAside>
    </template>

    <!-- Content -->
    <template v-for="({ id, label }, key) in PROFILE_MENU" :key>
      <UiTitle :id :title="label || ''" variant="primary" />
      <component :is="sections[id]" />
    </template>
  </UPage>
</template>
