<script setup>
import { computed } from 'vue'
// import { useRouter } from 'vue-router'
// import i18n from "@/lang/i18n"

// const router = useRouter()

const packageVersion = computed(() => import.meta.env.APP_VERSION || '0')
</script>

<template>
  <div class="header">
    <div class="header__top">
      <div class="header__brand">
        <img src="/images/logo_eslectric192x192.png" alt="Logo Eslectric">
      </div>
      <span class="label"><b>Eslectric</b></span>
      <div class="header__side-container">
        <div class="header__logout-container">
          <p class="header__version">
            v {{ packageVersion }}
          </p>
        </div>
      </div>
    </div>

    <!-- Main menu items -->
    <div class="header__menu">
      <router-link class="header__menuitem" :to="{ name: 'market' }">
        Precio Mercado
      </router-link>

      <router-link class="header__menuitem" :to="{ name: 'balance' }">
        Balance energético
      </router-link>
    </div>
  </div>
</template>

<style lang="scss">
.header {
  position: fixed;
  top: 0;
  width: 100%;
  height: $header-height-top;
  display: flex;
  flex-direction: column;
  align-items: center;
  z-index: 999;

  background-color: shade($broken-white-color, darker-1);

  @include breakpoint(sm) {
    height: $header-height;
  }

  &__alt {
    height: $header-height-compact;
    position: fixed;
    top: 0;
    width: 100%;
    background: $white-color;
    display: flex;
    justify-content: center;
    align-items: center;
    z-index: 100;

    @include bottom-shadow;

    p {
      margin-left: $spacer;
      margin-bottom: 0;
      font-weight: $font-weight-regular;
    }

    @include breakpoint(sm) {
      height: $header-height-compact;
    }
  }

  &__top {
    box-sizing: border-box;
    height: $header-height-top;
    width: 100%;
    max-width: $max-content-width;
    justify-content: flex-start;
    display: flex;
    align-items: center;
    padding: 0 $spacer;
    left: 0;

    @include breakpoint(sm) {
      align-items: flex-end;
    }
  }

  &__brand {
    margin-right: $spacer*0.12;
    margin-top: auto;
    margin-bottom: auto;
    width: $header-height-top*1.6*0.65; // 1.6 is the ratio between width and height for this logo.

    img {
      display: block;
      height: 3rem;
    }

    @include breakpoint(sm) {
      width: $header-height-top*1.6*0.7;  // 1.6 is the ratio between width and height for this logo.
      height: auto;
      margin-bottom: 0;
    }

    @include breakpoint(md) {
      margin-right: $spacer;
      width: $header-height-top*1.6*0.75;  // 1.6 is the ratio between width and height for this logo.
    }
  }

  &__side-container {
    display: flex;
    margin-left: auto;
    justify-content: center;
  }

  &__title {
    font-size: ms(4);
    font-weight: $font-weight-regular;
    color: $gray-color;
    text-transform: uppercase;
    align-self: center;
    line-height: 1;
  }

  &__version {
    font-size: ms(-2);
    margin: 0;
    color: $dark-gray-color;
    text-align: right;
    line-height: 1;
  }

  &__menu {
    box-sizing: border-box;

    position: fixed;
    bottom: 0;
    width: 100%;
    height: $bottom-menu-height;
    display: flex;
    background-color: $dark-gray-color;
    justify-content: space-between;
    align-items: flex-end;
    left: 0;

    @include breakpoint(sm) {
      align-items: center;
      padding: 0 $spacer;
      background-color: $white-color;
      height: $header-height-bottom;
      position: relative;
      max-width: $max-content-width;
      background-color: shade($broken-white-color, darker-1);
    }
  }

  &__icon {
    width: 22px;
    height: 22px;
    display: block;
    position: absolute;
    top: -16px;

    @include breakpoint(sm) {
      display: none;
    }
  }

  &__menuitem {
    display: flex;
    flex: 1;
    text-align: center;
    justify-content: center;
    line-height: 1.2;
    text-transform: uppercase;
    font-weight: $font-weight-regular;
    font-size: ms(-1);
    height: 1.25rem;
    align-items: center;
    padding: $spacer*0.12 $spacer-quarter;
    color: $white-color;
    text-decoration: none;
    position: relative;
    border-radius: $small-radius;

    &.router-link-exact-active {
      border-bottom: 5px solid $broken-white-color;
    }

    @include breakpoint(sm) {
      color: $white-color;
      background-color: shade($secondary-color, lighter-2);
      letter-spacing: 1px;
      font-size: ms(-1);
      margin: $spacer-half;
      padding: $spacer*0.12 $spacer-quarter;

      &:first-of-type {
        margin-left: 0;
      }

      &:last-of-type {
        margin-right: 0;
      }

      &.router-link-active {
        border-bottom: 0;
        background-color: $secondary-color;
        color: $white-color;

        &:hover {
          cursor: default;
        }
      }

      &:hover {
        background-color: $secondary-color;
        color: $white-color;
        cursor: pointer;
       }
    }

    @include breakpoint(md) {
      font-size: ms(0);
      padding: $spacer-third $spacer-half;
    }
  }
}
</style>
