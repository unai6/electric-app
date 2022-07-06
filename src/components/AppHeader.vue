<script setup>
import { computed } from 'vue'

const packageVersion = computed(() => import.meta.env.APP_VERSION || '0')
</script>

<template>
  <div class="header">
    <div class="header__top">
      <div class="header__brand">
        <img src="/images/logo_eslectric192x192.png" alt="Logo Eslectric">
        <span class="label"><b>Eslectric &nbsp; </b> {{ $d(new Date, 'longDayMonthHour') }}</span>
        <div class="header__navigation">
          <router-link class="header__link" :to="{ name: 'balance' }">
            Balance
          </router-link>
          <router-link class="header__link" :to="{ name: 'market' }">
            Mercados
          </router-link>
        </div>
      </div>
      <div class="header__side-container">
        <div class="header__logout-container">
          <p class="header__version">
            v {{ packageVersion }}
          </p>
        </div>
      </div>
    </div>
  </div>
</template>

<style lang="scss">
.header {
  position: fixed;
  bottom: 0;
  width: 100%;
  height: $header-height;
  display: flex;
  flex-direction: column;
  align-items: center;
  z-index: 999;
  background: $white-color;

  @include breakpoint (sm) {
    background-color: shade($broken-white-color, darker-1);
    top: 0;
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
    position: relative;
    margin-right: $spacer*0.12;
    margin-top: auto;
    margin-bottom: auto;
    width: 90%;
    display: flex;
    align-items: center;
    grid-column-gap: $spacer*0.5;

    span {
      display: none;

      @include breakpoint(sm) {
        display: block;
      }
    }

    img {
      display: none;

      @include breakpoint(sm) {
        display: block;
        height: 3rem;
      }
    }

    @include breakpoint(sm) {
      height: auto;
      margin-bottom: 0;
    }

  }

  &__side-container {
    display: flex;
    margin-left: auto;
    justify-content: center;
  }

  &__version {
    font-size: ms(-2);
    margin: 0;
    color: $dark-gray-color;
    text-align: right;
    line-height: 1;
  }

  &__navigation {
    display: flex;
    position: absolute;
    right: -1rem;
    width: 100%;
    justify-content: center;
    column-gap: $spacer*2;
    font-size: ms(2);

    @include breakpoint (sm) {
      width: 50%;
    }
  }

  &__link {
    text-decoration: none;
    padding: 0 $spacer;

    &:focus {
      background: $secondary-color;
      color: $white-color;
      padding: 0 $spacer;
      border-radius: $big-radius;
    }

    &:hover {
      background: shade($secondary-color, lighter-4);
      color: $white-color;
      padding: 0 $spacer;
      border-radius: $big-radius;
    }
  }
}
</style>
