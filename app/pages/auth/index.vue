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
  <UCard class="max-w-xl mx-auto mt-[10vh]">
    <UTabs :items>
      <template #login>
        <AuthLoginForm />
      </template>

      <template #register>
        <AuthRegisterForm />
      </template>
    </UTabs>
  </UCard>
</template>
