// import settings from 'electron-settings';
import defaults from './Default';
import prayTimes from './PrayerTimes';

const fn = {
  getNotificationKey(index){
    return "pray" + index;
  },
  getPrays(){
    var prays = [];
    var times = fn.loadPrayTimes();
    for (var time in times) {
      if(['sunrise', 'sunset', 'midnight'].indexOf(time) == -1){
          prays.push({name: time, time: times[time]});
      }
    }
    return prays;
  },
  setNotificationStatus(index, status){
    // settings.set(fn.getNotificationKey(index),status);
  },
  loadNotifications(){
    var notifications = [];
    for (var i = 0; i < 5; i++) {
      // notifications[i] = settings.get(fn.getNotificationKey(i));
    }
    return notifications;
  },
  getNextAzan(times){
    var prays = fn.getPrays(times)
    var today = new Date();
    var hours = today.getHours();
    var minutes = today.getMinutes();
    for (var index in prays) {
      if (prays.hasOwnProperty(index) && prays[index].name != "imsak") {
          var timeSplit = prays[index].time.split(":");
          if (timeSplit[0] > hours || (timeSplit[0] == hours && timeSplit[1] >= minutes)) {
            return prays[index].name;
          }
      }
    }
    return prays[0].name;
  },
  checkAzanNotification(prays, notifications){
    var today = new Date();
    var hours = today.getHours();
    var minutes = today.getMinutes();
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
    prayTimes.adjust({asr: defaults.asrCalculation});
    prayTimes.setMethod(defaults.calculationMethod);
    return prayTimes.getTimes(
      new Date(),
       [parseFloat(defaults.latitude),
        parseFloat(defaults.longitude)],
         parseInt(defaults.timeZone),
         parseInt(defaults.dayTimeSave),
         '24h');
  },
}

export default fn;