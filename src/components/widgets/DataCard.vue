<script setup>

const props = defineProps({
  title: {
    type: String,
    default: '',
  },
  isLoading: {
    type: Boolean,
    default: false,
  },
})

</script>

<template>
  <div class="data-card">
    <h3 v-if="props.title">
      {{ props.title }}
    </h3>
    <slot />
  </div>
</template>

<style lang="scss">
.data-card {
  display: flex;
  flex-direction: column;
  background: $very-light-gray-color;
  padding: $spacer;
  border-radius: $small-radius;
}
</style>