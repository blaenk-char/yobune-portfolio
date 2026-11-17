<script setup lang="ts">
/* Imports */
import type { H3Error } from '#build/types/nitro-imports'
import { UI_TEXT } from '#shared/constants'
import {
  forgotPasswordSchema,
  forgotPasswordState,
  type ForgotPasswordSchema
} from '#shared/schemas'
import type { FormSubmitEvent } from '@nuxt/ui'

/* Constants */
const { loading, forgotPassword } = useAuth()

/* Refs */
const state = reactive({ ...forgotPasswordState })

/* Functions */
async function onSubmit(event: FormSubmitEvent<ForgotPasswordSchema>) {
  try {
    const data = await forgotPassword(event.data)
    Object.assign(state, forgotPasswordState)
    addToast(data.message, 'success')
  } catch (error: unknown) {
    addToast((error as H3Error).statusMessage, 'error')
  }
}
</script>

<template>
  <!-- Forgot Password Form -->
  <UForm :schema="forgotPasswordSchema" :state @submit="onSubmit">
    <!-- Email -->
    <UFormField :label="UI_TEXT.email" name="email">
      <UInput v-model="state.email" />
    </UFormField>
    <!-- Submit -->
    <UiSubmitButton :label="UI_TEXT.sendLink" :loading />
  </UForm>
</template>
