<script setup>
import { Icon } from '@iconify/vue'
</script>

<template>
  <div class="not-found">
    <div class="not-found__card">
      <h1 class="not-found__message">
        <icon icon="eva:alert-triangle-fill" class="not-found__icon" />¡Oops! Lo sentimos, la página solicitada no existe.
      </h1>
      <router-link :to="{ name: 'dashboard' }">
        Volver a Eslectric
      </router-link>
    </div>
  </div>
</template>


<style lang="scss">
.not-found {
  display: flex;
  align-items: center;
  justify-content: center;

  &__card {
    @include bottom-shadow;

    background: $white-color;
    padding: $spacer*2;
    border-radius: $small-radius;
  }
  
  &__message {
    display: flex;
    align-items: center;
    column-gap: $spacer;
    color: $black-color;
  }

  &__icon {
    font-size: ms(7);
    color: $warning-color;
  }
}
</style>