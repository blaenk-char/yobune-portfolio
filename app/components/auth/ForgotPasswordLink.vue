<script setup lang="ts">
/* Imports */
import { UI_TEXT } from '#shared/constants'
</script>

<template>
  <div class="flex justify-end">
    <ULink to="/auth/forgot-password">{{ UI_TEXT.forgotPassword }}</ULink>
  </div>
</template>
