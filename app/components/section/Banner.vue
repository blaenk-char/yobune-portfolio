<script setup lang="ts">
/* Imports */
import { BANNERS, DialogId } from '#shared/constants'
</script>

<template>
  <div class="relative">
    <!-- Dialog -->
    <LazyUiDialog :id="DialogId.Banners" />

    <!-- Gallery -->
    <UiVerticalGallery :items="BANNERS" />
  </div>
</template>
