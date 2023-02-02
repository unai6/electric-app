<script setup>
import { ref, computed, inject } from 'vue'

import { Icon } from '@iconify/vue'
import { onClickOutside } from '@vueuse/core'

const props = defineProps({
  modelValue: {
    type: [String, Number],
    default: () => '',
  },
  type: {
    type: String,
    default: 'text',
  },
  placeholder: {
    type: String,
    default: null,
  },
  min: {
    type: String,
    default: null,
  },
  max: {
    type: String,
    default: null,
  },
  step: {
    type: String,
    default: null,
  },
  maxlength: {
    type: String,
    default: null,
  },
  icon: {
    type: String,
    default: null,
  },
  iconColor: {
    type: String,
    default: null,
  },
  isDisabled: {
    type: Boolean,
    default: false,
  },
  isReadonly: {
    type: Boolean,
    default: false,
  },
})

const emit = defineEmits(['update:modelValue', 'blur', 'focus', 'keyup', 'icon-click', 'click-outside'])

const fieldInputRef = ref(null)

const computedIconColor = computed(() => {
  if (props.isDisabled) return 'disabled'
  return props.iconColor || inject('baseFieldType', '')
})

onClickOutside(fieldInputRef, () => {
  if (!props.isDisabled) {
    emit('click-outside')
  }
})

function onIconClick() {
  if (!props.isDisabled) {
    emit('icon-click')
  }
}
</script>

<template>
  <div ref="fieldInputRef" class="form-field__input" :class="{ 'form-field__input--has-icon-right': icon }">
    <input
      :value="props.modelValue"
      :type="props.type"
      :placeholder="props.placeholder"
      :disabled="props.isDisabled"
      :readonly="props.isReadonly"
      :min="props.min"
      :max="props.max"
      :step="props.step"
      :maxlength="props.maxlength"
      @input="emit('update:modelValue', $event.target.value)"
      @blur="emit('blur')"
      @focus="emit('focus')"
      @keyup="emit('keyup', $event)"
    >
    <div v-if="icon" class="base-icon" @click.prevent="onIconClick">
      <icon :icon="icon" class="base-icon__icon" :class="`base-icon__icon--${computedIconColor}`" />
    </div>
  </div>
</template>

<style lang="scss">
.base-icon {
  align-items: center;
  display: flex;
  flex-direction: row;
  height: 100%;
  justify-content: center;
  width: 2rem;
  position: absolute;
  right: 0;
  top: 0;

  &__icon {
    height: 2rem;
    width: 2rem;
    padding: 0.5rem;
    color: $primary-color;

    &--disabled {
      color: $gray-color;
    }

    &--error {
      color: $danger-color;
    }
  }
}
</style>
