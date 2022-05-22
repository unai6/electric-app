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
    <div v-if="props.title">
      <h3>
        {{ props.title }}
      </h3>
    </div>
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