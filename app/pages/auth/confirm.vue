<script setup lang="ts">
/* Imports */
import { PAGES, UI_TEXT } from '#shared/constants'

/* Page */
definePageMeta({
  layout: PAGES.confirm.layout,
  middleware: PAGES.confirm.middleware
})
</script>

<template>
  <AuthCard :title="UI_TEXT.titleConfirm">
    <AuthConfirmForm />
  </AuthCard>
</template>
