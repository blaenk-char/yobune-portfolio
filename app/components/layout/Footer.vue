<script setup lang="ts">
/* Imports */
import { FOOTER_CONFIG, PAGES, SOCIALS, UI_TEXT } from '#shared/constants'
</script>

<template>
  <UFooter>
    <!-- Ownership -->
    <template #left>
      <p v-for="(line, key) in FOOTER_CONFIG.ownership" :key :class="{ 'font-bold': key === 0 }">
        {{ line }}
      </p>
    </template>

    <!-- Socials -->
    <UNavigationMenu :items="SOCIALS" variant="link" class="hidden sm:inline-block" />

    <!-- Contact -->
    <template #right>
      <p class="font-bold">{{ UI_TEXT.contact }}</p>
      <p>{{ FOOTER_CONFIG.contact }}</p>
    </template>

    <!-- Banner -->
    <template #bottom>
      <!-- Legal -->
      <span>
        © {{ new Date().getFullYear() }} {{ FOOTER_CONFIG.legal }}. {{ UI_TEXT.allRightsReserved }}
      </span>
      <!-- Divider -->
      <span class="hidden sm:inline-block">•</span>
      <!-- Privacy Policy -->
      <ULink :to="PAGES.privacy.url" :active="false">
        {{ UI_TEXT.privacyPolicy }}
      </ULink>
      <!-- Divider -->
      <span class="hidden sm:inline-block">•</span>
      <!-- Credit -->
      <ULink :to="FOOTER_CONFIG.credit" class="flex items-center gap-1">
        {{ UI_TEXT.createdBy }}
        <UButton
          icon="i-simple-icons-github"
          color="neutral"
          variant="ghost"
          target="_blank"
          class="p-1 cursor-default"
        />
      </ULink>
    </template>
  </UFooter>
</template>
