<script setup lang="ts">
/* Imports */
import { TITLES } from '#shared/constants'

/* Page */
definePageMeta({
  layout: 'public'
})
</script>

<template>
  <div>
    <LazyUiLightboxModal />

    <!-- Hero -->
    <UiReveal>
      <SectionHero class="mt-10" />
    </UiReveal>

    <!-- Banners -->
    <UiReveal>
      <LazyUiTitle :title="TITLES.animatedBanners" variant="primary" />

      <LazySectionBanner />
    </UiReveal>

    <!-- Animations -->
    <UiReveal>
      <LazyUiTitle :title="TITLES.ohterAnimations" variant="primary" />

      <LazySectionAnimation />
    </UiReveal>

    <!-- Character Sheets -->
    <UiReveal>
      <LazyUiTitle :title="TITLES.characterSheets" variant="primary" />

      <LazySectionCharacterSheets />
    </UiReveal>

    <!-- Other Images -->
    <UiReveal>
      <LazyUiTitle :title="TITLES.otherImages" variant="primary" />

      <LazySectionImage />
    </UiReveal>

    <!-- Nsfw -->
    <UiReveal>
      <LazyUiTitle :title="TITLES.nsfwGallery" variant="primary" />

      <LazySectionNsfw />
    </UiReveal>

    <!-- Working Process -->
    <UiReveal>
      <LazyUiTitle :title="TITLES.work" variant="primary" />

      <LazySectionWork />
    </UiReveal>

    <USeparator class="mt-10" />
  </div>
</template>
