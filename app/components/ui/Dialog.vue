<script setup lang="ts">
/* Imports */
import { DIALOG_CONFIG, type DialogId, DIALOGS } from '#shared/constants'

/* Props */
const props = defineProps<{ id: DialogId }>()

/* Constants */
const dialogStore = useDialogStore()

/* Variables */
const scene = DIALOGS.find((scene) => scene.id === props.id)
const text = ref<string>(scene?.dialog ?? '')
const { output, start } = useTypewriter(text)
const isActive = computed<boolean>(() => dialogStore.currentDialog?.id === props.id)

/* Watches */
watch(isActive, (active) => {
  if (!active) return
  dialogStore.onTypingStart()
  start(() => dialogStore.onTypingDone())
})
</script>

<template>
  <!-- Transition -->
  <Transition name="fade">
    <!-- Card -->
    <UCard
      v-if="scene && isActive"
      :id="scene.id"
      class="absolute top-1/2 -translate-y-1/2 sm:left-10 w-full sm:w-1/2 lg:w-1/3 shadow-xl z-100"
    >
      <div class="flex items-center gap-4 h-28 sm:h-24">
        <!-- Image -->
        <img :src="DIALOG_CONFIG.image" draggable="false" class="rounded-xl w-16 h-16" />
        <!-- Text -->
        <p>{{ output }}</p>
      </div>

      <!-- Footer -->
      <template #footer>
        <div class="flex justify-end gap-5 h-8">
          <!-- Action Button -->
          <UButton v-if="!dialogStore.isTyping" variant="outline" @click="dialogStore.stop">
            {{ DIALOG_CONFIG.disableActionLabel }}
          </UButton>
          <UButton v-if="!dialogStore.isTyping" @click="dialogStore.next">
            {{ scene.actionLabel ?? DIALOG_CONFIG.defaultActionLabel }}
          </UButton>
        </div>
      </template>
    </UCard>
  </Transition>
</template>

<style scoped>
.fade-enter-active,
.fade-leave-active {
  transition: opacity 0.3s ease;
}
.fade-enter-from,
.fade-leave-to {
  opacity: 0;
}
</style>
