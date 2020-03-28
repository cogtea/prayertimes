<template>
  <header class="toolbar toolbar-header draggable">
    <div class="toolbar-actions">
      <div class="btn-group">
        <button class="btn btn-default active">
          <span class="icon icon-home"></span>
        </button>
        <button class="btn btn-default" v-on:click="openSettings()">
          <span class="icon icon-cog"></span>
        </button>
      </div>
    </div>
  </header>
</template>

<script>
export default {
}
</script>

<style lang="css" scoped>
</style>
