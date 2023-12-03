<template>
    <table class="uk-table uk-table-small uk-table-divider">
      <tbody>
        <tr v-for="(pray, index) in prays" v-bind:class="{ next: pray.name == azanNext }" v-if="pray.name != 'imsak'">
          <td>
            <b class="uk-text">{{$t(pray.name)}}</b>
          </td>
          <td class="uk-text">{{pray.time}} <label class="uk-text-small" v-if="pray.name == 'fajr'">({{$t(prays[0].name)}} {{prays[0].time}})</label></td>
          <td>
            <button v-bind:class="notifications[index] ? 'uk-button uk-button-primary uk-button-small': 'uk-button uk-button-default uk-button-small'" v-on:click="click(index)">
              <span v-bind:uk-icon="notifications[index] ? 'icon: clock': 'icon: ban'" ></span>
            </button>
          </td>
        </tr>
      </tbody>
    </table>
</template>
<script>
export default{
  data: function () {
     return {
       prays: this.$root.prays,
       notifications: this.$root.notifications,
       azanNext: null,
       azanNextCheck: null,
     };
  },
  created: function () {
    this.setNextAzan();
    this.setIntervalNextAzan()
  },
  beforeDestroy: function () {
    if (this.azanNextCheck) {
      clearTimeout(this.azanNextCheck)
    }
  },
  methods: {
    click: function (index) {
      this.$root.updateNotificationStatus(index, !this.notifications[index]);
    },
    setNextAzan: function(){
      this.azanNext = this.$root.getNextAzan();
    },
    setIntervalNextAzan: function () {
      var self =  this;
      if (this.azanNextCheck) {
        clearTimeout(this.azanNextCheck)
      }
      this.azanNextCheck = setInterval(function(){
        self.setNextAzan();
      }, 60 * 1000);
    }
  }
};
</script>
<style lang="css" scoped>
</style>
