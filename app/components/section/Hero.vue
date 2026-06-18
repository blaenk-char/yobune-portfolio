<script setup lang="ts">
/* Imports */
import { DialogId, HERO } from '#shared/constants'
</script>

<template>
  <div class="relative">
    <!-- Hero Image -->
    <UiImage class="w-full rounded-4xl! min-h-42 object-cover" :src="HERO" />

    <!-- Dialogs -->
    <LazyUiDialog :id="DialogId.Intro" />
    <LazyUiDialog :id="DialogId.End" />
  </div>
</template>
