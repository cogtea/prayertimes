<template>
  <h5 class="uk-animation-fade uk-margin-top"><router-link class="uk-link-heading" to="/settings">{{city}}<span uk-icon="icon: location"></span></router-link></h5>
</template>

<script>
var defaults = require('../utilities/Default.js');

const Store = window.electron.store;
export default {
  data:function () {
    return {
      city: Store.get('city', defaults.city)
    }
  }
}
</script>
<style lang="css" scoped></style>
