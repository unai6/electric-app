<script setup>
import { watch, ref } from 'vue'

const props = defineProps({
  modelValue: {
    type: Boolean,
    default: false,
  },
  canConfirm: {
    type: Boolean,
    default: false,
  },
  withActions: {
    type: Boolean,
    default: true,
  },
  withCancel: {
    type: Boolean,
    default: false,
  },
  withCloseTag: {
    type: Boolean,
    default: false,
  },
  withHeader: {
    type: Boolean,
    default: true,
  },
})

const emit = defineEmits(['update:modelValue'])

const dialogRef = ref()

watch(() => props.modelValue, (value) => {
  if (value) dialogRef.value.showModal()
})

function closeModal () {
  emit('update:modelValue', false)
  dialogRef.value.close()
}
</script>

<template>
  <dialog ref="dialogRef" class="modal">
    <slot name="closeTag">
      <button class="modal__close" @click="closeModal" />
    </slot>
    <slot name="header" />
    <slot name="body" />
    <slot v-if="props.withActions" name="actions">
      <button class="button button--secondary" @click="closeModal">
        Aceptar
      </button>
      <button v-if="props.withCancel">
        Cancelar
      </button>
    </slot>
  </dialog>
</template>

<style lang="scss">
.modal {
  background: $transp-black-color;
  position: relative;
  border: none;
  border-radius: $medium-radius;
  width: 85vw;

  @include breakpoint(sm) {
    width: 60vw;
    background: $black-color;
  }

  &::backdrop {
    background: $black-color;

    @include breakpoint (md) {
      background: rgba(0,0,0, 1);
    }
  }

  &__close {
    position: absolute;
    right: $spacer;
    background: none;
    color: $white-color;
    font-size: ms(1);
    border: none;
    cursor: pointer;

    &::after {
      position: absolute;
      content: url('https://api.iconify.design/ci/off-outline-close.svg?color=white&width=30&height=30');
      right: 0;
      top: 0;
    }
  }
}
</style>