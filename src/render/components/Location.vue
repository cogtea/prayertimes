<template>
  <h5 class="uk-animation-fade uk-margin-top"><router-link class="uk-link-heading" to="/settings">{{city}}<span uk-icon="icon: location"></span></router-link></h5>
</template>

<script>
const settings = require('electron-settings');
var defaults = require('../utilities/Default.js');
export default {
  data:function () {
    return {
      city: ''
    }
  },
  methods: {
    updateTime: function () {
        this.city = settings.get('city', defaults.city)
    }
  }
}
</script>
