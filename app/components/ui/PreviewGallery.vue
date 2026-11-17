<script setup lang="ts">
/* Props */
defineProps<{
  items: string[]
}>()

/* Refs */
const selectedKey = ref(0)
</script>

<template>
  <div class="flex flex-col sm:flex-row gap-5 items-center sm:h-[46vw]">
    <!-- Left: Big Preview -->
    <div class="w-full sm:w-1/2 h-[60vw] sm:h-full flex items-center justify-center">
      <Transition name="fade-scale" mode="out-in">
        <UiImage :key="selectedKey" :src="items[selectedKey]!" class="max-w-full max-h-full" />
      </Transition>
    </div>

    <!-- Right: Grid -->
    <div class="w-full sm:w-1/2 sm:pl-1 sm:pr-4">
      <div class="grid grid-cols-3 gap-2">
        <!-- Image -->
        <div
          v-for="(sheet, key) in items"
          :key
          class="relative cursor-pointer overflow-hidden rounded-xl"
          :class="
            key === selectedKey
              ? 'ring-2 ring-white ring-offset-2 ring-offset-black'
              : 'opacity-60 hover:opacity-100'
          "
          style="aspect-ratio: 1 / 1"
          @click="selectedKey = key"
        >
          <img
            :src="sheet"
            alt="Character sheet preview"
            loading="lazy"
            draggable="false"
            class="w-full h-full object-cover transition-transform duration-300 hover:scale-105"
          />
        </div>
      </div>
    </div>
  </div>
</template>

<style lang="css" scoped>
.fade-scale-enter-active,
.fade-scale-leave-active {
  transition:
    opacity 0.25s ease,
    transform 0.25s ease;
}
.fade-scale-enter-from {
  opacity: 0;
  transform: scale(0.96);
}
.fade-scale-leave-to {
  opacity: 0;
  transform: scale(1.03);
}
</style>
