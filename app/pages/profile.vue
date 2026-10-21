<script setup lang="ts">
/* Imports */
import ProfileUsername from '~/components/profile/Username.vue'
import { PROFILE_MENU, PROFILE_SECTIONS } from '~~/shared/constants'

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

    <!-- Content -->
    <template v-for="({ id, label }, key) in PROFILE_MENU" :key>
      <UiTitle :id :title="label || ''" variant="primary" :class="{ 'mt-3!': key === 0 }" />

      <!-- Username -->
      <ProfileUsername v-if="id === PROFILE_SECTIONS.username" />
    </template>
  </UPage>
</template>
