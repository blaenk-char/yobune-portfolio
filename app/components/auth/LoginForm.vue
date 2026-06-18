<script setup lang="ts">
/* Imports */
import { UI_TEXT } from '#shared/constants'
import { loginSchema, type LoginSchema } from '#shared/schemas'
import type { FormSubmitEvent } from '@nuxt/ui'

/* Constants */
const { loading, login } = useAuth()
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
    router.push('/')
  } catch (error: unknown) {
    addToast((error as Error).message, 'error')
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
    <!-- Submit -->
    <UiCenterDiv>
      <UButton type="submit" :label="UI_TEXT.login" block :loading class="w-1/2" />
    </UiCenterDiv>
  </UForm>
</template>
