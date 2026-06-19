<script setup lang="ts">
/* Imports */
import { UI_TEXT } from '#shared/constants'

/* Page */
definePageMeta({
  layout: 'public',
  middleware: 'guest'
})

/* Constants */
const items = [
  {
    label: UI_TEXT.login,
    slot: 'login'
  },
  {
    label: UI_TEXT.register,
    slot: 'register'
  }
]
</script>

<template>
  <AuthCard>
    <UTabs :items>
      <template #login>
        <AuthLoginForm />
      </template>

      <template #register>
        <AuthRegisterForm />
      </template>
    </UTabs>
  </AuthCard>
</template>
