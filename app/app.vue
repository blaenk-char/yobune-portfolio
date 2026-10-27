<script setup>
/* Imports */
import { DIALOG_CONFIG } from '#shared/constants'

/* Head */
useHead({
  meta: [{ name: 'viewport', content: 'width=device-width, initial-scale=1' }],
  link: [{ rel: 'icon', href: '/favicon.ico' }],
  htmlAttrs: {
    lang: 'en'
  }
})

/* Constants */
const dialog = useDialogStore()

/* Lifecycle Hooks */
onNuxtReady(() => {
  if (!localStorage.getItem(DIALOG_CONFIG.storageKey)) dialog.next()
})
</script>

<template>
  <UApp>
    <NuxtLayout>
      <LayoutCursor />
      <NuxtPage />
    </NuxtLayout>
  </UApp>
</template>
