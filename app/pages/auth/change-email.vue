<script setup lang="ts">
/* Imports */
import { PAGES } from '~~/shared/constants'

/* Page */
definePageMeta({
  layout: PAGES.changeEmail.layout,
  middleware: PAGES.changeEmail.middleware
})
</script>

<template>
  <AuthConfirmEmail />
</template>
