<template>
    <table class="uk-table uk-table-small uk-table-divider">
      <tbody>
        <tr v-for="(pray, index) in prays" class="active">
          <td><b class="uk-text">{{pray.name}}</b></td>
          <td class="uk-text">{{pray.time}}</td>
          <td>
            <button class="uk-button uk-button-primary uk-button-small" v-on:click="click(index)" v-if="notifications[index]">
              <span uk-icon="icon: clock" ></span>
            </button>
            <button class="uk-button uk-button-default uk-button-small" v-on:click="click(index)" v-else>
              <span uk-icon="icon: ban" ></span>
            </button>
          </td>
        </tr>
      </tbody>
    </table>
</template>
<script>
import Vue from 'vue';
var prayTimes = require('../utilities/PrayerTimes.js');
var defaults = require('../utilities/Default.js');
const settings = require('electron-settings');
import azan from '../../assets/sound/azan.mp3';
export default{
  data: function () {
     return {
       times: [],
       notifications: [],
       azanTimer: null,
       azanAudio: null,
     };
  },
  created: function () {
    this.loadNotifications();
    this.calculateTimes();    
    this.checkForAzanNotification();
  },
  methods: {
    notificationKey: function (index) {
      return "pray" + index;
    },
    click: function (index) {
      // https://vuejs.org/v2/guide/list.html#Caveats
      // Due to limitations in JavaScript, Vue cannot detect the following changes to an array [When you directly set an item with the index]
      Vue.set(this.notifications, index, !this.notifications[index]);
      settings.set(this.notificationKey(index),this.notifications[index]);
    },
    calculateTimes: function () {
      prayTimes.prayTimes.adjust({asr: settings.get('asrCalculation',defaults.asrCalculation)});
      prayTimes.prayTimes.setMethod(settings.get('calculationMethod',defaults.calculationMethod));
      this.times = prayTimes.prayTimes.getTimes(new Date(), [parseFloat(settings.get('latitude',defaults.latitude)), parseFloat(settings.get('longitude',defaults.longitude))], parseInt(settings.get('timeZone',defaults.timeZone)),parseInt(settings.get('dayTimeSave', defaults.dayTimeSave)),'24h');    
    },
    loadNotifications: function () {
      for (var i = 0; i < 5; i++) {
        this.notifications[i] = settings.get(this.notificationKey(i));
      }
    },
    checkForAzanNotification: function () {
      var self =  this;
      if (this.azanTimer) {
        clearTimeout(this.azanTimer)
      }
      this.azanTimer = setInterval(function(){
        var today = new Date();
        var hours = today.getHours();
        var minutes = today.getMinutes();
        
        for (var index in self.prays) {
          if (self.prays.hasOwnProperty(index)) {
            if (self.notifications[index]){
              var timeSplit = self.prays[index].time.split(":");
              if(timeSplit[0] == hours && timeSplit[1] == minutes){                  
                var notification = new Notification('Time to Pray', {
                  body: self.prays[index].name.toUpperCase(),
                  requireInteraction: true
                });
                
                if (self.azanAudio == null) {
                  self.azanAudio = new Audio(azan);
                }
                self.azanAudio.currentTime = 0;
                self.azanAudio.play();

                notification.onclick = function (event) {
                  self.azanAudio.pause();
                  self.azanAudio.currentTime = 0;
                };
                break;
              }
            }
          }
        }
      }, 60 * 1000);
    }
  },
  computed: {
    prays: function () {
      var prays = [];
      for (var time in this.times) {
        if(['imsak', 'sunrise', 'sunset', 'midnight'].indexOf(time) == -1){
            prays.push({name: this.$t(time), time: this.times[time]});
        }
      }
      return prays;
    }
  }
};
</script>