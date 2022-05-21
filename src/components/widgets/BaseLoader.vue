<template>
  <div class="base-loader">
    <div class="base-loader__circle" />
  </div>
</template>

<style lang="scss">
.base-loader {
  background: $white-color;
  position: absolute;
  bottom: 0;
  top: 0;
  right: 0;
  left: 0;
  display: flex;
  align-items: center;
  justify-content: center;
  z-index: 999;
  background-color: rgba($color: $white-color, $alpha: 0.5);

  &__circle {
    transform: translate(-50%, 50%);
    height: 64px;
    width: 64px;
    border-radius: 50%;
    border: 4px solid $secondary-color;
    border-top: 4px solid transparent;
    animation: spinner 4s linear infinite;
  }

  @keyframes spinner {
    0% {
      transform: rotate(0deg);
    }

    100% {
      transform: rotate(360deg);
    }
  } 
}
</style>