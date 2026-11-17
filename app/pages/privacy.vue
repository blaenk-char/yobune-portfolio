<script setup lang="ts">
/* Imports */
import { PRIVACY_POLICY } from '#shared/constants'

/* Page */
definePageMeta({
  layout: 'public'
})
</script>

<template>
  <UEditor :model-value="PRIVACY_POLICY" content-type="markdown" :editable="false" class="my-10" />
</template>
