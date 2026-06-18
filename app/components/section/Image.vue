<script setup lang="ts">
/* Imports */
import { DialogId, IMAGES } from '#shared/constants'
</script>

<template>
  <div class="relative">
    <!-- Dialog -->
    <LazyUiDialog :id="DialogId.Images" />

    <!-- Masonry Grid -->
    <UiMasonryGrid :items="IMAGES" :columns="4" />
  </div>
</template>
