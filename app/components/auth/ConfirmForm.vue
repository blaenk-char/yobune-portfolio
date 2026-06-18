<script setup lang="ts">
/* Imports */
import type { H3Error } from '#build/types/nitro-imports'
import { UI_TEXT } from '#shared/constants'
import { confirmSchema, type ConfirmSchema } from '#shared/schemas'
import type { FormSubmitEvent } from '@nuxt/ui'

/* Constants */
const { loading, confirm } = useAuth()
const route = useRoute()
const router = useRouter()

/* Refs */
const state = reactive<Partial<ConfirmSchema>>({
  username: undefined
})

/* Functions */
async function onSubmit(event: FormSubmitEvent<ConfirmSchema>) {
  try {
    const data = await confirm({ ...event.data, token: route.query.token as string })
    addToast(data.message, 'success')
    router.push('/auth')
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
      <UInput v-model="state.username" />
    </UFormField>
    <!-- Submit -->
    <UiCenterDiv>
      <UButton type="submit" :label="UI_TEXT.confirm" block :loading class="w-1/2" />
    </UiCenterDiv>
  </UForm>
</template>
