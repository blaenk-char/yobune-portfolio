<script setup lang="ts">
/* Imports */
import type { H3Error } from '#build/types/nitro-imports'
import { UI_TEXT } from '#shared/constants'
import { registerSchema, type RegisterSchema } from '#shared/schemas'
import type { FormSubmitEvent } from '@nuxt/ui'

/* Constants */
const { loading, register } = useAuth()
const router = useRouter()

/* Refs */
const state = reactive<Partial<RegisterSchema>>({
  email: undefined,
  password: undefined
})

/* Functions */
async function onSubmit(event: FormSubmitEvent<RegisterSchema>) {
  try {
    const data = await register(event.data)
    addToast(data.message, 'success')
    router.push('/')
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
    <!-- Submit -->
    <UiSubmitButton :label="UI_TEXT.register" :loading />
  </UForm>
</template>
