<template>
  <h2 class="uk-animation-fade uk-margin-top">{{time}}</h2>
</template>

<script>
const Store = window.electron.store;
export default {
  data:function () {
    return {
      time: ''
    }
  },
  methods: {
    updateTime: function () {
        this.time = new Date().toLocaleTimeString(Store.get('language','en'), { hour: "numeric",
                                            minute: "numeric"});
    }
  },
  created: function () {
    var self = this;
    self.updateTime();
    setInterval(function () {
      self.updateTime();
    }, 1000)
  }
}
</script>
