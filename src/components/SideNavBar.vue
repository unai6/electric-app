<template>
  <div class="sidebar">
    <router-link :to="{ name: 'dashboard' }" class="sidebar__link">
      Balance
    </router-link>
    <router-link :to="{ name: 'market'}" class="sidebar__link">
      Mercados
    </router-link>
  </div>
</template>

<style lang="scss">
.sidebar {
  position: fixed;
  display: flex;
  flex-direction: column;
  justify-content: flex-start;
  align-items: center;
  row-gap: $spacer;
  width: $side-navbar-width;
  height: 100%;
  background: shade($broken-white-color, darker-1);
  z-index: 999;
}
</style>
