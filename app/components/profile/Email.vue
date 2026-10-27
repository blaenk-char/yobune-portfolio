<script setup lang="ts">
/* Imports */
import type { H3Error } from '#build/types/nitro-imports'
import { UI_TEXT } from '#shared/constants'
import { changeEmailSchema, changeEmailState, type ChangeEmailSchema } from '#shared/schemas'
import type { FormSubmitEvent } from '@nuxt/ui'

/* Constants */
const { loading, changeEmail } = useAuth()

/* Refs */
const state = reactive({ ...changeEmailState })

/* Functions */
async function onSubmit(event: FormSubmitEvent<ChangeEmailSchema>) {
  try {
    const data = await changeEmail(event.data)
    Object.assign(state, changeEmailState)
    addToast(data.message, 'success')
  } catch (error: unknown) {
    addToast((error as H3Error).statusMessage, 'error')
  }
}
</script>

<template>
  <!-- Confirm Form -->
  <UForm :schema="changeEmailSchema" :state @submit="onSubmit">
    <!-- Email -->
    <UFormField :label="UI_TEXT.emailNew" name="email">
      <UInput v-model="state.email" />
    </UFormField>
    <!-- Submit -->
    <UiSubmitButton :label="UI_TEXT.sendLink" :loading />
  </UForm>
</template>
