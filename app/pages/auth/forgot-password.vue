<script setup lang="ts">
/* Imports */
import { PAGES, UI_TEXT } from '#shared/constants'

/* Page */
definePageMeta({
  layout: PAGES.forgotPassword.layout,
  middleware: PAGES.forgotPassword.middleware
})
</script>

<template>
  <AuthCard :title="UI_TEXT.titleForgotPassword">
    <AuthForgotPasswordForm />
  </AuthCard>
</template>
