const settings = require('electron-settings');

const defaults = require('./Default.js');
const prayTimes = require('./PrayerTimes.js');

const fn = {
  getNotificationKey(index){
    return "pray" + index;
  },
  getPrays(){
    var prays = [];
    var times = fn.loadPrayTimes();
    for (var time in times) {
      if(['imsak', 'sunrise', 'sunset', 'midnight'].indexOf(time) == -1){
          prays.push({name: time, time: times[time]});
      }
    }
    return prays;
  },
  setNotificationStatus(index, status){
    settings.set(fn.getNotificationKey(index),status);
  },
  loadNotifications(){
    var notifications = [];
    for (var i = 0; i < 5; i++) {
      notifications[i] = settings.get(fn.getNotificationKey(i));
    }
    return notifications;
  },
  getNextAzan(times){
    var prays = fn.getPrays(times)
    var today = new Date();
    var hours = today.getHours();
    var minutes = today.getMinutes();
    for (var index in prays) {
      if (prays.hasOwnProperty(index)) {
          var timeSplit = prays[index].time.split(":");
          if (timeSplit[0] > hours || (timeSplit[0] == hours && timeSplit[1] >= minutes)) {
            return prays[index].name;
          }
      }
    }
    return prays[0].name;
  },
  checkAzanNotification(prays, notifications){
    for (var index in prays) {
      if (prays.hasOwnProperty(index)) {
        if (notifications[index]){
          var timeSplit = prays[index].time.split(":");
          if(timeSplit[0] == hours && timeSplit[1] == minutes){
            return prays[index].name.toUpperCase();  
          }
        }
      }
    }
    return false;
  },
  loadPrayTimes() {
    prayTimes.prayTimes.adjust({asr: settings.get('asrCalculation',defaults.asrCalculation)});
    prayTimes.prayTimes.setMethod(settings.get('calculationMethod',defaults.calculationMethod));
    
    return prayTimes.prayTimes.getTimes(
      new Date(),
       [parseFloat(settings.get('latitude',defaults.latitude)),
        parseFloat(settings.get('longitude',defaults.longitude))],
         parseInt(settings.get('timeZone',defaults.timeZone)),
         parseInt(settings.get('dayTimeSave', defaults.dayTimeSave)),
         '24h');    
  },
}

export default fn