<script setup lang="ts">
/* Props */
const props = defineProps<{
  title: string
  variant: 'primary' | 'secondary'
  id?: string
}>()

/* Functions */
const titleCLass = computed(() => {
  switch (props.variant) {
    case 'primary':
      return 'text-2xl sm:text-3xl mt-20'
    case 'secondary':
      return 'text-lg sm:text-xl mb-2 ml-2'
    default:
      return ''
  }
})
</script>

<template>
  <div :id class="font-bold" :class="titleCLass">
    {{ title }}
  </div>

  <USeparator v-if="variant === 'primary'" class="my-3" />
</template>
