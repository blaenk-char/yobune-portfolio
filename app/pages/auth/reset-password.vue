<script setup lang="ts">
/* Imports */
import { PAGES, UI_TEXT } from '#shared/constants'

/* Page */
definePageMeta({
  layout: PAGES.resetPassword.layout,
  middleware: PAGES.resetPassword.middleware
})
</script>

<template>
  <AuthCard :title="UI_TEXT.resetPassword">
    <AuthResetPasswordForm />
  </AuthCard>
</template>
