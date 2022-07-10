<script setup>
import { RouterView } from 'vue-router'
import AppHeader from '@/components/AppHeader.vue'
import Navbar from '@/components/Navbar.vue'
</script>

<template>
  <div id="app">
    <app-header />
    <div class="app__view">
      <navbar />
      <router-view class="app__content" />
    </div>
  </div>
</template>

<style lang="scss">
.app {
  
  &__view {
    background-color: shade($broken-white-color, darker-1);
    min-height: calc(100vh - #{$bottom-menu-height});

    @include breakpoint(md) {
      display: grid;
      grid-template-columns: 1fr 5fr;
    }
  }

  &__content {
    position: relative;
    padding: $spacer;
    margin-left: auto;
    margin-top: 0;
    box-sizing: border-box;
    background: $transp-black-color;
    
    &--compact {
      margin-top: $header-height-compact !important;

      @include breakpoint(sm) {
        margin-top: $header-height-compact !important;
      }
    }

    @include breakpoint(sm) {
      min-height: calc(100vh - #{$header-height});
    }
  }
}
</style>
