<script setup lang="ts">
/* Refs */
const sectionRef = useTemplateRef('sectionRef')
const isVisible = ref(false)

/* Lifecycle Hooks */
const { stop } = useIntersectionObserver(
  sectionRef,
  ([entry]) => {
    if (entry?.isIntersecting) {
      isVisible.value = true
      stop()
    }
  },
  {
    threshold: 0.2
  }
)
</script>

<template>
  <section
    ref="sectionRef"
    class="transition-all duration-1000 ease-out relative"
    :class="isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-6'"
  >
    <slot></slot>
  </section>
</template>
