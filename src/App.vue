<script setup>
import { RouterView } from 'vue-router'
import AppHeader from '@/components/AppHeader.vue'

</script>

<template>
  <div id="app">
    <app-header />
    <router-view class="app__content" />
  </div>
</template>

<style lang="scss">
.app {
  &__content {
    position: relative;
    padding: $spacer;
    margin-top: $header-height-top + $spacer;
    margin-bottom: $bottom-menu-height + $spacer;
    min-height: calc(100vh - #{$bottom-menu-height});
    max-width: $max-content-width;
    box-sizing: border-box;

    &--compact {
      margin-top: $header-height-compact !important;

      @include breakpoint(sm) {
        margin-top: $header-height-compact !important;
      }
    }

    @include breakpoint(sm) {
      margin-top: $header-height;
      min-height: calc(100vh - #{$header-height} - #{$spacer});
    }

    @include breakpoint(lg) {
      margin-left: auto;
      margin-right: auto;
    }
  }
}
</style>
