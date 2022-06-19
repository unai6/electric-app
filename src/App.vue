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
    margin-top: 0;
    min-height: calc(100vh - #{$bottom-menu-height});
    box-sizing: border-box;
    background: $transp-black-color;

    @include breakpoint(sm) {
      margin-top: $header-height-top + $spacer;
    }
    
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
      margin-right: auto;
    }
  }
}
</style>
