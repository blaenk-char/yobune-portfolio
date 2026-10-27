<script setup lang="ts">
/* Imports */
import type { H3Error } from '#build/types/nitro-imports'
import { UI_TEXT } from '#shared/constants'
import { registerSchema, registerState, type RegisterSchema } from '#shared/schemas'
import type { FormSubmitEvent } from '@nuxt/ui'

/* Constants */
const { loading, register } = useAuth()

/* Refs */
const state = reactive({ ...registerState })

/* Functions */
async function onSubmit(event: FormSubmitEvent<RegisterSchema>) {
  try {
    const data = await register(event.data)
    Object.assign(state, registerState)
    addToast(data.message, 'success')
  } catch (error: unknown) {
    addToast((error as H3Error).statusMessage, 'error')
  }
}
</script>

<template>
  <!-- Register Form -->
  <UForm :schema="registerSchema" :state @submit="onSubmit">
    <!-- Email -->
    <UFormField :label="UI_TEXT.email" name="email">
      <UInput v-model="state.email" />
    </UFormField>
    <!-- Password -->
    <UFormField :label="UI_TEXT.password" name="password">
      <AuthPasswordInput v-model="state.password" />
    </UFormField>
    <!-- Confirm Password -->
    <UFormField :label="UI_TEXT.passwordConfirm" name="confirmPassword">
      <AuthPasswordInput v-model="state.confirmPassword" />
    </UFormField>
    <!-- Submit -->
    <UiSubmitButton :label="UI_TEXT.register" :loading />
  </UForm>
</template>
