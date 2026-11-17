<script setup lang="ts">
/* Imports */
import type { H3Error } from '#build/types/nitro-imports'
import { UI_TEXT } from '#shared/constants'

/* Constants */
const { loading, deleteAccount } = useAuth()

/* Refs */
const isOpen = ref(false)

/* Functions */
async function onSubmit() {
  try {
    const data = await deleteAccount()
    isOpen.value = false
    addToast(data.message, 'success')
  } catch (error: unknown) {
    addToast((error as H3Error).statusMessage, 'error')
  }
}
</script>

<template>
  <UiCenterDiv>
    <UModal
      v-model:open="isOpen"
      :title="UI_TEXT.deleteAccount"
      :description="UI_TEXT.deleteAccountConfirm"
    >
      <UButton :label="UI_TEXT.deleteAccount" color="error" variant="outline" block />

      <template #footer>
        <div class="flex justify-end gap-3 w-full">
          <UButton
            :label="UI_TEXT.cancel"
            color="neutral"
            variant="ghost"
            @click="isOpen = false"
          />
          <UButton :label="UI_TEXT.deleteAccount" color="error" :loading @click="onSubmit" />
        </div>
      </template>
    </UModal>
  </UiCenterDiv>
</template>
