<script setup lang="ts">
/* Imports */
import type { H3Error } from '#build/types/nitro-imports'
import { PAGES, UI_TEXT } from '#shared/constants'
import { resetPasswordSchema, type ResetPasswordSchema } from '#shared/schemas'
import type { FormSubmitEvent } from '@nuxt/ui'

/* Constants */
const { loading, resetPassword } = useAuth()
const route = useRoute()
const router = useRouter()

/* Refs */
const state = reactive<Partial<ResetPasswordSchema>>({
  password: undefined
})

/* Functions */
async function onSubmit(event: FormSubmitEvent<ResetPasswordSchema>) {
  try {
    const data = await resetPassword({ ...event.data, token: route.query.token as string })
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
      <AuthPasswordInput v-model="state.password" />
    </UFormField>
    <!-- Submit -->
    <UiSubmitButton :label="UI_TEXT.resetPassword" :loading />
  </UForm>
</template>
