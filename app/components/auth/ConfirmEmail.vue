<script setup lang="ts">
/* Imports */
import { ERROR_MESSAGE, PAGES, SUCCESS_MESSAGE, UI_TEXT } from '#shared/constants'
import type { AuthError } from '@supabase/supabase-js'

/* Constants */
const { loading, confirmEmail } = useAuth()
const route = useRoute()

/* Refs */
const statusMessage = ref<string | undefined>(UI_TEXT.emailUpdating)

/* Functions */
async function onSubmit() {
  try {
    await confirmEmail({ token: route.query.token as string })

    // feedback
    statusMessage.value = UI_TEXT.redirecting
    addToast(SUCCESS_MESSAGE.emailUpdate, 'success')

    // redirect to profile
    await navigateTo(PAGES.profile.url)
  } catch (error: unknown) {
    statusMessage.value = (error as AuthError).message || ERROR_MESSAGE.server
    addToast((error as AuthError).message, 'error')
  }
}

/* Lifecycle Hooks */
onMounted(onSubmit)
</script>

<template>
  <UiCenterDiv>
    <div>
      <UPageHero :title="statusMessage">
        <UProgress v-if="loading" class="-mt-10" />
      </UPageHero>
    </div>
  </UiCenterDiv>
</template>
