<template>
  <div class="uk-container">
    <form class="uk-form-stackedv uk-text-left uk-margin-top">
      <ul uk-accordion>
          <li>
              <a class="uk-accordion-title uk-text-small" href="#">{{ $t('location')}}</a>
              <div class="uk-accordion-content">
                <div class="uk-margin">
                  <!-- Select location -->
                  <googlemaps-map
                    ref="map"
                    class="map"
                    :center.sync="location"
                    :zoom.sync="zoom"
                   >        
                    <!-- Marker -->
                    <googlemaps-marker
                      title="My location"
                      :draggable="true"
                      :position="location"
                      @dragend="onMarkerDrag"
                       />

                  </googlemaps-map>
                  <!-- Select location-->
                </div>
                <div class="uk-margin">
                  <label class="uk-form-label">{{$t('latitude')}}</label>
                  <div class="uk-form-controls">
                    <input type="text" class="uk-input" placeholder="Latitude" v-model="latitude">
                  </div>
                </div>
                <div class="uk-margin">
                  <label class="uk-form-label">{{$t('longitude')}}</label>
                  <div class="uk-form-controls">
                    <input type="text" class="uk-input" placeholder="Longitude" v-model="longitude">
                  </div>
                </div>
                <div class="uk-margin">
                  <label class="uk-form-label">{{$t('city')}}</label>
                  <div class="uk-form-controls">
                    <input type="text" class="uk-input" placeholder="City" v-model="city">
                  </div>
                </div>
                <button class="uk-button uk-button-default uk-button-small" type="button" v-on:click="updateLocation()">USE LOCATION<span uk-icon="icon: location"></span></button>
              </div>
          </li>
          <li>
              <a class="uk-accordion-title uk-text-small" href="#">{{ $t('time')}}</a>
              <div class="uk-accordion-content">
                <div class="uk-margin">
                  <label class="uk-form-label">{{$t('time_zone')}}</label>
                  <div class="uk-form-controls">
                    <input type="text" class="uk-input" placeholder="Time Zone" v-model="timeZone">
                  </div>
                </div>
                <div class="uk-margin">
                  <label class="uk-form-label">{{$t('calculation_method')}}</label>
                  <div class="uk-form-controls">
                    <select class="uk-select" v-model="calculationMethod">
                      <option value="MWL" >Muslim World League</option>
                      <option value="ISNA" >Islamic Society of North America</option>
                      <option value="Egypt" >Egyptian General Authority of Survey</option>
                      <option value="Makkah" >Umm al-Qura University, Makkah</option>
                      <option value="Karachi" >University of Islamic Sciences, Karachi</option>
                      <option value="Tehran" >Institute of Geophysics, University of Tehran</option>
                      <option value="Jafari" >Shia Ithna Ashari (Ja`fari)</option>
                    </select>
                  </div>
                </div>
                <div class="uk-margin">
                  <label class="uk-form-label">{{$t('asr_calculation')}}</label>
                  <div class="uk-form-controls">
                    <select class="uk-select" v-model="asrCalculation">
                      <option value="Standard">Shafii, Maliki, Jafari and Hanbali (shadow factor = 1)</option>
                      <option value="Hanafi">Hanafi school of tought (shadow factor = 2)</option>
                    </select>
                  </div>
                </div>
                <div class="uk-margin">
                   <div class="uk-form-controls">
                     <input type="checkbox" class="uk-checkbox" v-model="dayTimeSave"> {{$t('daytime_save')}}
                   </div>
                </div>
              </div>
          </li>
          <li>
              <a class="uk-accordion-title uk-text-small" href="#">{{ $t('language')}}</a>
              <div class="uk-accordion-content">
                <div class="uk-margin">
                  <div class="uk-form-controls">
                    <select class="uk-select" v-model="language">
                      <option value="ar">{{$t('lang.arabic')}}</option>
                      <option value="en" >{{$t('lang.english')}}</option>
                    </select>
                  </div>
                </div>
            </div>
          </li>
      </ul>
      <div class="uk-margin">
        <div class="uk-form-controls">
          <button class="uk-button uk-button-primary" type="button" v-on:click="updateSettings()">{{ $t('update')}}</button>
          <button class="uk-button uk-button-primary" type="button" v-on:click="resetSettings()">{{ $t('reset')}}</button>
        </div>
      </div>
    </form>
    <app-loader v-show="appLoader"></app-loader>
  </div>
</template>
<script>
import defaults from '../utilities/Default';
import eventBus from '../utilities/EventBus.js';
const Store = window.electron.store;

export default{
  data: function () {
     return {
       id: null,
       city: Store.get('city',defaults.city),
       latitude: Store.get('latitude',defaults.latitude),
       longitude: Store.get('longitude',defaults.longitude),
       timeZone: Store.get('timeZone',defaults.timeZone),
       calculationMethod: Store.get('calculationMethod',defaults.calculationMethod),
       dayTimeSave: Store.get('dayTimeSave',defaults.dayTimeSave) == "1",
       asrCalculation: Store.get('asrCalculation',defaults.asrCalculation),
       language: Store.get('language','en'),
       appLoader: false,
  		 options: {
          
  		 },
  		 zoom: 12
     };
  },
  created: function () {

  },
  mounted: function (){
    this.id = this._uid;
  },
  methods: {
    setLoader: function (show) {
      this.appLoader = show;
    },
    resetSettings: function () {
      this.latitude = defaults.latitude;
      this.longitude = defaults.longitude;
      this.timeZone = defaults.timeZone;
      this.calculationMethod = defaults.calculationMethod;
      this.dayTimeSave = defaults.dayTimeSave == "1";
      this.asrCalculation = defaults.asrCalculation;
      this.language = defaults.language;
      this.city = defaults.city;
      this.updateSettings();
    },
    updateSettings: function () {
      var self = this;
      Store.set('latitude',this.latitude);
      Store.set('longitude',this.longitude);
      Store.set('timeZone',this.timeZone);
      Store.set('calculationMethod',this.calculationMethod);
      Store.set('dayTimeSave',this.dayTimeSave?"1":"0");
      Store.set('asrCalculation',this.asrCalculation);
      Store.set('language',this.language);
      Store.set('city',this.city);
      
      eventBus.emit('updateSettings', 'ok');
      
      setTimeout(function () {
        self.$ui.notification({
            message: self.$t('messages.update_settings'),
            status: 'success',
            pos: 'bottom-center',
            timeout: 1000
        });
      },500);
      
    },
    updateLocation: function () {
      var self = this;
      if (navigator.geolocation) {
        this.setLoader(true);
        navigator.geolocation.getCurrentPosition(function (position) {
          self.latitude = position.coords.latitude;
          self.longitude = position.coords.longitude;
          self.setLoader(false);
        },function (error) {
          console.log(error.message);
          self.setLoader(false);
        },{ enableHighAccuracy: true });
      } else {
        console.log("Geolocation is not supported by this browser.");
      }
    },
    onMarkerDrag: function (position) {
      this.latitude = position.latLng.lat();
      this.longitude = position.latLng.lng();
    }
  },
  computed: {
    location: {
  		get: function() {
         if (this.latitude != null && this.longitude !=null) {
           return {	lat: parseFloat(this.latitude), lng: parseFloat(this.longitude) };
         }
         return {lat: 0.0, lng: 0.0}
  		},
  		set: function(latLng) {
        this.latitude = latLng.lat;
        this.longitude = latLng.lng;
  		}
    }
  }
};
</script>
<style lang="css">
  form {
    padding-right: 10px;
    padding-left: 10px;
  }
  .map{
    height: 230px;
  }
</style>
