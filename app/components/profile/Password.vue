<script setup lang="ts">
/* Imports */
import type { H3Error } from '#build/types/nitro-imports'
import { UI_TEXT } from '#shared/constants'
import {
  changePasswordSchema,
  changePasswordState,
  type ChangePasswordSchema
} from '#shared/schemas'
import type { FormSubmitEvent } from '@nuxt/ui'

/* Constants */
const { loading, changePassword } = useAuth()

/* Refs */
const state = reactive({ ...changePasswordState })

/* Functions */
async function onSubmit(event: FormSubmitEvent<ChangePasswordSchema>) {
  try {
    const data = await changePassword(event.data)
    Object.assign(state, changePasswordState)
    addToast(data.message, 'success')
  } catch (error: unknown) {
    addToast((error as H3Error).statusMessage, 'error')
  }
}
</script>

<template>
  <!-- Confirm Form -->
  <UForm :schema="changePasswordSchema" :state @submit="onSubmit">
    <!-- Password -->
    <UFormField :label="UI_TEXT.passwordCurrent" name="password">
      <AuthPasswordInput v-model="state.password" />
    </UFormField>
    <!-- Submit -->
    <UiSubmitButton :label="UI_TEXT.sendLink" :loading />
  </UForm>
</template>
