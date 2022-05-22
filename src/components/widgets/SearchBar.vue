º<script setup>
import { Icon } from '@iconify/vue'

const emit = defineEmits(['search'])

function search (value) {
  emit('search', value)
}
</script>

<template>
  <div class="search-bar form-field__input form-field__input--has-icon-left">
    <div class="search-bar-icon">
      <icon icon="feather:search" class="search-bar-icon__icon" />
    </div>
    <input type="text" :placeholder="$t('common.label.find')" @keyup.enter="search($event.target.value)">
  </div>
</template>

<style lang="scss">
.search-bar {
  flex-grow: 0.3;
}

.search-bar-icon {
  align-items: center;
  display: flex;
  height: 100%;
  justify-content: center;
  width: 2rem;
  position: absolute;
  left: 0;
  top: 0;

  &__icon {
    height: 2rem;
    width: 2rem;
    padding: 0.5rem;
    color: $primary-color;
  }
}
</style>
