<script setup lang="ts">
/* Imports */
import { CURSOR_CONFIG, DIALOG_CONFIG, PAGES, SOCIALS, TITLES, UI_TEXT } from '#shared/constants'

/* Constants */
const settingsStore = useSettingsStore()
const { reset } = useDialogStore()
const authStore = useAuthStore()
const showSmClass = 'hidden sm:inline-flex'

/* Computeds */
const cursorLabel = computed(() =>
  settingsStore.cursor ? CURSOR_CONFIG.trueLabel : CURSOR_CONFIG.falseLabel
)
</script>

<template>
  <UHeader>
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

      <!-- Reset Dialog -->
      <UButton
        v-if="settingsStore.showDialog"
        size="md"
        :class="`${showSmClass} text-nowrap`"
        @click="reset"
      >
        {{ DIALOG_CONFIG.resetLabel }}
      </UButton>

      <!-- NSFW Switch -->
      <USwitch
        v-if="settingsStore.showNsfw"
        v-model="settingsStore.nsfw"
        :label="UI_TEXT.nsfwMode"
        :class="`${showSmClass} mx-2`"
      />

      <!-- Profile -->
      <NuxtLink v-if="authStore.profile" :to="PAGES.profile.url" :class="showSmClass">
        <UAvatar :text="authStore.profile.username.at(0)?.toUpperCase()" />
      </NuxtLink>

      <!-- Auth -->
      <UButton v-else :to="PAGES.auth.url" :class="showSmClass">
        {{ UI_TEXT.login }}
      </UButton>
    </template>

    <!-- Drawer Content -->
    <template #body>
      <div class="flex flex-col h-full">
        <!-- Top -->
        <div class="flex-1">
          <!-- Links -->
          <UNavigationMenu :items="SOCIALS" orientation="vertical" />

          <USeparator class="my-2" />

          <!-- Profile / Auth -->
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

        <USeparator />

        <!-- Bottom -->
        <div class="grid grid-flow-col auto-cols-fr place-items-center gap-4 my-3">
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
    </template>
  </UHeader>
</template>
