<script setup lang="ts">
/* Imports */
import type { H3Error } from '#build/types/nitro-imports'
import { UI_TEXT } from '#shared/constants'
import type { FormSubmitEvent } from '@nuxt/ui'
import { changePasswordSchema, type ChangePasswordSchema } from '~~/shared/schemas'

/* Constants */
const { loading, changePassword } = useAuth()

/* Refs */
const state = reactive<Partial<ChangePasswordPayload>>({
  password: undefined
})

/* Functions */
async function onSubmit(event: FormSubmitEvent<ChangePasswordSchema>) {
  try {
    const data = await changePassword(event.data)
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
