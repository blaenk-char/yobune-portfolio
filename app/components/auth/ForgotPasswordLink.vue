<script setup lang="ts">
/* Imports */
import { PAGES, UI_TEXT } from '#shared/constants'
</script>

<template>
  <div class="flex justify-end">
    <ULink :to="PAGES.forgotPassword.url">{{ UI_TEXT.forgotPassword }}</ULink>
  </div>
</template>
