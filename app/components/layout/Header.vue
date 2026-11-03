<script setup lang="ts">
/* Imports */
import { CURSOR_CONFIG, DIALOG_CONFIG, PAGES, SOCIALS, TITLES, UI_TEXT } from '#shared/constants'
import { createReusableTemplate } from '@vueuse/core'

/* Constants */
const settingsStore = useSettingsStore()
const { reset } = useDialogStore()
const authStore = useAuthStore()
const route = useRoute()
const showSmClass = 'hidden sm:inline-flex'
const [DefineMenuContent, ReuseMenuContent] = createReusableTemplate()

/* Refs */
const popoverOpen = ref(false)

/* Computeds */
const cursorLabel = computed(() =>
  settingsStore.cursor ? CURSOR_CONFIG.trueLabel : CURSOR_CONFIG.falseLabel
)
const avatarText = computed(() => authStore.profile?.username.at(0)?.toUpperCase() ?? '?')

/* Watches */
watch(
  () => route.fullPath,
  () => {
    popoverOpen.value = false
  }
)
</script>

<template>
  <!-- Reusable Menu Content (used in Popover & Drawer) -->
  <DefineMenuContent>
    <div class="flex flex-col h-full">
      <!-- Top -->
      <div class="flex-1">
        <!-- Links -->
        <UNavigationMenu :items="SOCIALS" orientation="vertical" />

        <USeparator class="my-2" />

        <!-- Menu Button -->
        <UButton
          :to="authStore.profile ? PAGES.profile.url : PAGES.auth.url"
          variant="ghost"
          size="md"
          color="neutral"
          block
          class="justify-start"
        >
          {{ authStore.profile ? UI_TEXT.profile : `${UI_TEXT.login} / ${UI_TEXT.register}` }}
        </UButton>
      </div>

      <USeparator class="my-2" />

      <!-- Bottom (Mobile Only) -->
      <div class="grid sm:hidden grid-flow-col auto-cols-fr place-items-center gap-4 my-2">
        <!-- Color Mode -->
        <UColorModeButton size="xl" />

        <!-- Cursor Mode -->
        <UButton
          v-if="settingsStore.showCursor"
          variant="ghost"
          size="xl"
          color="neutral"
          @click="settingsStore.toggleCursor"
        >
          {{ cursorLabel }}
        </UButton>

        <!-- NSFW Switch -->
        <USwitch
          v-if="settingsStore.showNsfw"
          v-model="settingsStore.nsfw"
          :label="UI_TEXT.nsfwMode"
        />
      </div>

      <!-- Reset Dialog -->
      <UButton
        v-if="settingsStore.showDialog"
        size="md"
        block
        class="text-nowrap mb-3"
        @click="reset"
      >
        {{ DIALOG_CONFIG.resetLabel }}
      </UButton>

      <!-- Logout -->
      <AuthLogoutButton v-if="authStore.profile" />
    </div>
  </DefineMenuContent>

  <UHeader mode="drawer">
    <!-- Title -->
    <template #title> {{ TITLES.main }} </template>

    <!-- Links -->
    <UNavigationMenu :items="SOCIALS" class="hidden xl:inline-flex" />

    <!-- Right Side -->
    <template #right>
      <!-- Color Mode -->
      <UColorModeButton :class="showSmClass" />

      <!-- Cursor Mode -->
      <UButton
        v-if="settingsStore.showCursor"
        variant="ghost"
        size="md"
        color="neutral"
        :class="showSmClass"
        @click="settingsStore.toggleCursor"
      >
        {{ cursorLabel }}
      </UButton>

      <!-- NSFW Switch -->
      <USwitch
        v-if="settingsStore.showNsfw"
        v-model="settingsStore.nsfw"
        :label="UI_TEXT.nsfwMode"
        :class="`${showSmClass} mx-2`"
      />

      <!-- Desktop Popover -->
      <UPopover v-model:open="popoverOpen" :content="{ align: 'end', sideOffset: 8 }">
        <button type="button" :class="showSmClass">
          <UAvatar :text="avatarText" />
        </button>

        <template #content>
          <div class="p-4 w-72">
            <ReuseMenuContent />
          </div>
        </template>
      </UPopover>
    </template>

    <!-- Mobile Drawer -->
    <template #toggle="{ toggle }">
      <button type="button" class="sm:hidden" @click="toggle">
        <UAvatar :text="avatarText" />
      </button>
    </template>

    <!-- Mobile Drawer Content -->
    <template #body>
      <ReuseMenuContent />
    </template>
  </UHeader>
</template>
