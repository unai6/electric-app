<template>
  <div class="sidebar">
    <router-link :to="{ name: 'market'}">
      Mercados
    </router-link>
  </div>
</template>

<style lang="scss">
.sidebar {
  position: fixed;
  width: $side-navbar-width;
  height: 100%;
  background: shade($broken-white-color, darker-1);
  z-index: 999;

}
</style>
