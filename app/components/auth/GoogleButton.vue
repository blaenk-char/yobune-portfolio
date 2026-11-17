<script setup lang="ts">
/* Imports */
import { UI_TEXT } from '#shared/constants'

/* Constants */
const { loading, loginWithGoogle } = useAuth()

/* Functions */
async function onSubmit() {
  try {
    await loginWithGoogle()
  } catch (error: unknown) {
    addToast((error as Error).message, 'error')
  }
}
</script>

<template>
  <UButton
    :label="UI_TEXT.continueWithGoogle"
    icon="i-simple-icons-google"
    color="secondary"
    variant="subtle"
    block
    :loading
    @click="onSubmit"
  />
</template>
