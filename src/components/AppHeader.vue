<script setup>
import { computed } from 'vue'

const packageVersion = computed(() => import.meta.env.APP_VERSION || '0')

</script>
<template>
  <div class="header">
    <div class="header__app-info">
      <img class="header__logo" src="/images/logo_eslectric192x192.png" alt="Logo Eslectric">
      <h4 class="header__heading">
        Eslectric&nbsp;|&nbsp;<span>{{ new Intl.DateTimeFormat('es-ES', { dateStyle: 'full', timeStyle: 'short' }).format(new Date()) }}</span>
      </h4>
    </div>
    <small>v {{ packageVersion }}</small>
  </div>
</template>

<style lang="scss">
.header {
  display: none;

  @include breakpoint(sm) {
    position: relative;
    display: flex;
    justify-content: space-between;
    align-items: center;
    padding: 0 $spacer*2;
    height: $header-height;
    background: $white-color;
    background-color: shade($broken-white-color, darker-1);

    &__app-info {
      display: flex;
      justify-content: center;
      align-items: center;
    }

    &__heading {
      color: $dark-gray-color;
      margin: 0;
      
      span {
        font-weight: $font-weight-light;
      }
    }

    &__logo {
      width: 40px;
      margin-right: $spacer-half;
    }
  }
}
</style>
