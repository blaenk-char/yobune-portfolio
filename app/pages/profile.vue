<script setup lang="ts">
/* Imports */
import LogoutButton from '~/components/auth/LogoutButton.vue'

/* Page */
definePageMeta({
  layout: 'public',
  middleware: 'auth'
})
</script>

<template>
  <LogoutButton />
</template>
