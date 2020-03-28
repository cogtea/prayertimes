<template>
  <div class="app-loader">
    <div class="uk-position-cover custom-spinner">
        <div class="uk-position-medium uk-position-center uk-overlay uk-overlay-default uk-card uk-card-primary uk-position-fixed">
          <div uk-spinner="ratio: 2"></div>
      </div>
    </div>
  </div>
</template>
<style lang="css">
  .app-loader{
    position:absolute;
    text-align:center;
    width:100%;
    height:100%;
  }
  .app-loader img{
    width: 65px;
    position: absolute;
    background: rgba(255, 255, 255, 1.0);
    box-shadow: 0 1px 2px rgba(0,0,0,0.15);
    transition: all 0.3s ease-in-out;
    border-radius: 5px;
    padding: 5px;
    margin: auto;
    top: 0;
    left: 0;
    right: 0;
    bottom: 0;
  }
</style>
