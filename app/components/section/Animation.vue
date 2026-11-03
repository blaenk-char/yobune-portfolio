<script setup lang="ts">
/* Imports */
import { ANIMATIONS, DialogId } from '#shared/constants'
</script>

<template>
  <div class="relative">
    <!-- Dialog -->
    <LazyUiDialog :id="DialogId.Animations" />

    <!-- Masonry Grid -->
    <UiMasonryGrid :items="ANIMATIONS" :columns="3" />
  </div>
</template>
