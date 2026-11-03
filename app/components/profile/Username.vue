<script setup lang="ts">
/* Imports */
import type { H3Error } from '#build/types/nitro-imports'
import { UI_TEXT } from '#shared/constants'
import { usernameSchema, usernameState, type UsernameSchema } from '#shared/schemas'
import type { FormSubmitEvent } from '@nuxt/ui'

/* Constants */
const { loading, updateUsername } = useProfile()
const authStore = useAuthStore()

/* Refs */
const state = reactive({
  ...usernameState,
  username: authStore.profile?.username
})

/* Functions */
async function onSubmit(event: FormSubmitEvent<UsernameSchema>) {
  try {
    const data = await updateUsername(event.data)
    addToast(data.message, 'success')
  } catch (error: unknown) {
    addToast((error as H3Error).statusMessage, 'error')
  }
}
</script>

<template>
  <!-- Confirm Form -->
  <UForm :schema="usernameSchema" :state @submit="onSubmit">
    <!-- Username -->
    <UFormField :label="UI_TEXT.username" name="username">
      <UInput v-model="state.username" />
    </UFormField>
    <!-- Submit -->
    <UiSubmitButton :label="UI_TEXT.usernameUpdate" :loading />
  </UForm>
</template>
