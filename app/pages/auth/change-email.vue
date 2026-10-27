<script setup lang="ts">
/* Page */
definePageMeta({
  layout: 'public',
  middleware: 'token'
})
</script>

<template>
  <AuthConfirmEmail />
</template>
