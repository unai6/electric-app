<script setup>
import { provide, computed } from 'vue'

const props = defineProps({
  label: {
    type: String,
    default: null,
  },
  message: {
    type: String,
    default: null,
  },
  messageType: {
    type: String,
    default: null,
  },
})

provide('baseFieldType', props.messageType)

const messageModifier = computed(() => props.messageType ? `base-field__message--${props.messageType}` : '')
</script>

<template>
  <div class="base-field">
    <label v-if="props.label" class="base-field__label">{{ props.label }}</label>
    <slot />
    <p v-if="props.message" class="base-field__message" :class="messageModifier">
      {{ props.message }}
    </p>
  </div>
</template>

<style lang="scss">
.base-field {
  position: relative;
  margin-top: $spacer-quarter;
  margin-bottom: $spacer-half;

  &__label {
    display: block;
    font-size: ms(-1);
    font-weight: $font-weight-light;
    color: $dark-gray-color;
    margin-bottom: $spacer-quarter;
  }

  &__message {
    font-size: ms(-1);
    margin-top: $spacer-half;
    margin-left: $spacer-half;
    margin-bottom: 0;
    font-weight: $font-weight-regular;
    line-height: 1;

    &--error {
      color: $danger-color;
    }

    &--warning {
      color: $warning-color;
    }
  }
}
</style>
