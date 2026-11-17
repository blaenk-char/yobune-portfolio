<script setup lang="ts">
/* Imports */
import { PAGES, PROFILE_MENU, PROFILE_SECTIONS } from '#shared/constants'

/* Page */
definePageMeta({
  layout: PAGES.profile.layout,
  middleware: PAGES.profile.middleware
})

/* Constants */
const authStore = useAuthStore()

/* Computeds */
const menuItems = computed(() =>
  authStore.isOAuth
    ? PROFILE_MENU.filter(
        (item) => item.id !== PROFILE_SECTIONS.email && item.id !== PROFILE_SECTIONS.password
      )
    : PROFILE_MENU
)
</script>

<template>
  <UPage>
    <!-- List Aside -->
    <template #left>
      <UPageAside>
        <UNavigationMenu :items="menuItems" orientation="vertical" />
      </UPageAside>
    </template>

    <!-- Content -->
    <template v-for="({ id, label }, key) in menuItems" :key>
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

      <!-- Delete Account -->
      <ProfileDelete v-if="id === PROFILE_SECTIONS.deleteAccount" />
    </template>
  </UPage>
</template>
