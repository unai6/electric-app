<script setup></script>

<template>
  <div class="app-navbar">
    <router-link class="app-navbar__link" :to="{ name: 'market' }">
      Mercado
    </router-link>
    <router-link class="app-navbar__link" :to="{ name: 'balance' }">
      Balance eléctrico
    </router-link>
  </div>  
</template>

<style lang="scss">
.app-navbar {
  position: fixed;
  display: flex;
  justify-content: space-evenly;
  align-items: center;
  bottom: 0;
  background: $white-color;
  z-index: 999;
  height: $bottom-menu-height;
  width: 100%;

  @include breakpoint(md) {
    position: relative;
    display: flex;
    align-items: flex-start;
    justify-content: flex-start;
    flex-direction: column;
    row-gap: $spacer;
    padding-left: $spacer*2;
    padding-top: $spacer*2;
    box-sizing: border-box;
    height: calc(100vh - #{$bottom-menu-height});
    background-color: shade($broken-white-color, darker-1);
  }

  &__link {
    font-size: ms(1);
    text-decoration: none;

    &:focus,
    &:hover {
      color: shade($secondary-color, lighter-2);
    }
  }
}
</style>