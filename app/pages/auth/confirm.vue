<script setup lang="ts">
/* Imports */
import { UI_TEXT } from '#shared/constants'

/* Page */
definePageMeta({
  layout: 'public',
  middleware: ['guest', 'token']
})
</script>

<template>
  <AuthCard :title="UI_TEXT.titleConfirm">
    <AuthConfirmForm />
  </AuthCard>
</template>
