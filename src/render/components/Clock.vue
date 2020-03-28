<template>
  <h1 class="uk-animation-fade uk-margin-top">{{time}}</h1>
</template>

<script>
export default {
  data:function () {
    return {
      time: ''
    }
  },
  methods: {
    updateTime: function () {
        this.time = new Date().toLocaleTimeString('en', { hour: "numeric",
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
