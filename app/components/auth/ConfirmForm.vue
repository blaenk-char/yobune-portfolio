<script setup lang="ts">
/* Imports */
import type { H3Error } from '#build/types/nitro-imports'
import { PAGES, UI_TEXT } from '#shared/constants'
import { confirmSchema, confirmState, type ConfirmSchema } from '#shared/schemas'
import type { FormSubmitEvent } from '@nuxt/ui'

/* Constants */
const { loading, confirm } = useAuth()
const route = useRoute()
const router = useRouter()

/* Refs */
const state = reactive({
  ...confirmState,
  token: route.query.token as string
})

/* Functions */
async function onSubmit(event: FormSubmitEvent<ConfirmSchema>) {
  try {
    const data = await confirm(event.data)
    addToast(data.message, 'success')
    router.push(PAGES.home.url)
  } catch (error: unknown) {
    addToast((error as H3Error).statusMessage, 'error')
  }
}
</script>

<template>
  <!-- Confirm Form -->
  <UForm :schema="confirmSchema" :state @submit="onSubmit">
    <!-- Username -->
    <UFormField :label="UI_TEXT.username" name="username">
      <UInput v-model="state.username" autocomplete="off" />
    </UFormField>
    <!-- Submit -->
    <UiSubmitButton :label="UI_TEXT.confirm" :loading />
  </UForm>
</template>
