<script setup lang="ts">
const { isOpen, close, image } = useLightbox()

const imgStyle = ref({})

function onImageLoad(e: Event) {
  const img = e.target as HTMLImageElement
  const naturalW = img.naturalWidth
  const naturalH = img.naturalHeight

  const maxW = window.innerWidth * 0.85
  const maxH = window.innerHeight * 0.85

  const scaleW = maxW / naturalW
  const scaleH = maxH / naturalH
  const scale = Math.min(scaleW, scaleH)

  imgStyle.value = {
    width: `${naturalW * scale}px`,
    height: `${naturalH * scale}px`
  }
}
</script>

<template>
  <UModal
    id="lightboxModal"
    v-model:open="isOpen"
    class="w-fit overflow-hidden! max-w-[85vw]"
    @after:leave="close"
  >
    <template #content>
      <img
        :src="image"
        alt="Enlarged artwork"
        :style="imgStyle"
        class="block max-w-[85vw]"
        @load="onImageLoad"
      />
    </template>
  </UModal>
</template>
