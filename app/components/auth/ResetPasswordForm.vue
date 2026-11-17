<script setup lang="ts">
/* Imports */
import type { H3Error } from '#build/types/nitro-imports'
import { PAGES, UI_TEXT } from '#shared/constants'
import { resetPasswordSchema, resetPasswordState, type ResetPasswordSchema } from '#shared/schemas'
import type { FormSubmitEvent } from '@nuxt/ui'

/* Constants */
const { loading, resetPassword } = useAuth()
const route = useRoute()
const router = useRouter()

/* Refs */
const state = reactive({
  ...resetPasswordState,
  token: route.query.token as string
})

/* Functions */
async function onSubmit(event: FormSubmitEvent<ResetPasswordSchema>) {
  try {
    const data = await resetPassword(event.data)
    addToast(data.message, 'success')
    router.push(PAGES.auth.url)
  } catch (error: unknown) {
    addToast((error as H3Error).statusMessage, 'error')
  }
}
</script>

<template>
  <!-- Reset Password Form -->
  <UForm :schema="resetPasswordSchema" :state @submit="onSubmit">
    <!-- Password -->
    <UFormField :label="UI_TEXT.password" name="password">
      <AuthPasswordInput v-model="state.password" autocomplete="new-password" />
    </UFormField>
    <!-- Confirm Password -->
    <UFormField :label="UI_TEXT.passwordConfirm" name="confirmPassword">
      <AuthPasswordInput v-model="state.confirmPassword" autocomplete="new-password" />
    </UFormField>
    <!-- Submit -->
    <UiSubmitButton :label="UI_TEXT.resetPassword" :loading />
  </UForm>
</template>
