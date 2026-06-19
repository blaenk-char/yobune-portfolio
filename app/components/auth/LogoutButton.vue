<script setup lang="ts">
/* Imports */
import { UI_TEXT } from '#shared/constants'

/* Constants */
const { logout } = useAuth()

/* Functions */
async function onLogout() {
  try {
    await logout()
  } catch (error: unknown) {
    addToast((error as Error).message, 'error')
  }
}
</script>

<template>
  <UButton :label="UI_TEXT.logout" @click="onLogout" />
</template>
