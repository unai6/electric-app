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
