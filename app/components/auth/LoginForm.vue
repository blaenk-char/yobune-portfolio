<script setup lang="ts">
/* Imports */
import { PAGES, UI_TEXT } from '#shared/constants'
import { loginSchema, type LoginSchema } from '#shared/schemas'
import type { FormSubmitEvent } from '@nuxt/ui'
import type { AuthError } from '@supabase/supabase-js'

/* Constants */
const { loading, login } = useAuth()
const route = useRoute()
const router = useRouter()

/* Refs */
const state = reactive<Partial<LoginSchema>>({
  email: undefined,
  password: undefined
})

/* Functions */
async function onSubmit(event: FormSubmitEvent<LoginSchema>) {
  try {
    await login(event.data)
    const redirect = route.query.redirect as string | undefined
    router.push(redirect?.startsWith('/') ? redirect : PAGES.home.url)
  } catch (error: unknown) {
    addToast((error as AuthError).message, 'error')
  }
}
</script>

<template>
  <!-- Login Form -->
  <UForm :schema="loginSchema" :state @submit="onSubmit">
    <!-- Email -->
    <UFormField :label="UI_TEXT.email" name="email">
      <UInput v-model="state.email" />
    </UFormField>
    <!-- Password -->
    <UFormField :label="UI_TEXT.password" name="password">
      <AuthPasswordInput v-model="state.password" />
    </UFormField>
    <!-- Forgot Password -->
    <AuthForgotPasswordLink />
    <!-- Submit -->
    <UiSubmitButton :label="UI_TEXT.login" :loading />
  </UForm>
</template>
