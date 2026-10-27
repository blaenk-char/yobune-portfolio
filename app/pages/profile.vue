<script setup lang="ts">
/* Imports */
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

      <!-- Email -->
      <ProfileEmail v-if="id === PROFILE_SECTIONS.email" />

      <!-- Password -->
      <ProfilePassword v-if="id === PROFILE_SECTIONS.password" />

      <!-- Logout -->
      <UiCenterDiv v-if="id === PROFILE_SECTIONS.logout">
        <AuthLogoutButton />
      </UiCenterDiv>
    </template>
  </UPage>
</template>
