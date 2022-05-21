<script setup>
import { RouterView } from 'vue-router'

</script>

<template>
  <div id="app">
    <app-header />
    <router-view class="app__content" />
  </div>
</template>