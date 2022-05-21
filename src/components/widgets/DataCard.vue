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