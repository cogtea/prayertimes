<template>
  <h5 class="uk-animation-fade uk-margin-top"><router-link class="uk-link-heading" to="/settings">{{city}}<span uk-icon="icon: location"></span></router-link></h5>
</template>

<script>
import settings from '../utilities/Settings.js';
var defaults = require('../utilities/Default.js');
export default {
  data:function () {
    return {
      city: settings.get('city', defaults.city)
    }
  }
}
</script>
