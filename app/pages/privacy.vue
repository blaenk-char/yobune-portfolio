<script setup lang="ts">
/* Imports */
import { PAGES, PRIVACY_POLICY } from '#shared/constants'

/* Page */
definePageMeta({
  layout: PAGES.privacy.layout
})
</script>

<template>
  <UEditor :model-value="PRIVACY_POLICY" content-type="markdown" :editable="false" class="my-10" />
</template>
