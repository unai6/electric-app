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
    <div v-if="props.isLoading" class="data-card__loader">
      <div class="loading loading--big" />
    </div>
  </div>
</template>

<style lang="scss">
.data-card {
  position: relative;
  display: flex;
  flex-direction: column;
  background: shade($black-color, lighter-2);
  padding: $spacer;
  border-radius: $small-radius;

  &__loader {
    position: absolute;
    margin: -$spacer;
    padding-top: $spacer*2;
    width: 100%;
    height: 100%;
    display: flex;
    justify-content: center;
    align-items: top;
    background-color: rgba($broken-white-color, 0.6);
    border-radius: $small-radius;
    z-index: 1;
  }
}
</style>