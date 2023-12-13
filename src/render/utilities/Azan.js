// src/render/utilities/Azan.js
import defaults from './Default';
import prayTimes from './PrayerTimes';

const Store = window.electron.store;

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
    Store.set(fn.getNotificationKey(index), status);
  },
  loadNotifications(){
    var notifications = [];
    for (var i = 0; i < 6; i++) {
      notifications[i] = Store.get(fn.getNotificationKey(i),false);
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
    const asrCalculation = Store.get('asrCalculation', defaults.asrCalculation);
    const calculationMethod = Store.get('calculationMethod', defaults.calculationMethod);
    const latitude = Store.get('latitude', defaults.latitude);
    const longitude = Store.get('longitude', defaults.longitude);
    const timeZone = Store.get('timeZone', defaults.timeZone);
    const dayTimeSave = Store.get('dayTimeSave', defaults.dayTimeSave);

    // Use the retrieved preferences
    prayTimes.adjust({ asr: asrCalculation });
    prayTimes.setMethod(calculationMethod);

    return prayTimes.getTimes(
      new Date(),
      [parseFloat(latitude), parseFloat(longitude)],
      parseInt(timeZone),
      parseInt(dayTimeSave),
      '24h'
    );
  },
}

export default fn;