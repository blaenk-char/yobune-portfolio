<script setup lang="ts">
/* Imports */
import { UI_TEXT } from '#shared/constants'

/* Page */
definePageMeta({
  layout: 'public',
  middleware: 'guest'
})
</script>

<template>
  <AuthCard :title="UI_TEXT.resetPassword">
    <AuthResetPasswordForm />
  </AuthCard>
</template>
