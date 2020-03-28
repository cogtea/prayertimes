import Vue from 'vue';
import VueRouter from 'vue-router';
Vue.use(VueRouter);

// Main
const {ipcRenderer, remote} = require('electron');
const settings = require('electron-settings');

// Localization
import VueI18n from 'vue-i18n';
Vue.use(VueI18n);

var loadedLanguages = ['en'];
import localization from '../assets/i18n/en';

var messages = {
  en: localization,
};

const i18n = new VueI18n({
  locale: 'en',
  messages
});

function getMainCssLinkIndex() {
  var elements = document.getElementsByTagName('link');
  for (var i = 0, length = elements.length; i < length; i++) {
    if (elements[i].href.indexOf('assets/css/main') >= 0) {
        return i;
    }
  }
}

function setI18nLanguage (lang, direction) {
  i18n.locale = lang;
  document.querySelector('html').setAttribute('lang', lang);
  if (document.getElementsByTagName('link').length >0) {
    document.getElementsByTagName('link')[getMainCssLinkIndex()].href = document.getElementsByTagName('link')[getMainCssLinkIndex()].href.replace(document.querySelector('html').getAttribute('dir'), direction);
  }
  document.querySelector('html').setAttribute('dir', direction);
  return lang;
}

// Lazy load language
export function loadLanguageAsync (lang) {
  if (i18n.locale !== lang) {
    if (!loadedLanguages.includes(lang)) {
      return import(/* webpackChunkName: "lang-[request]" */ `../assets/i18n/${lang}`).then(msgs => {
        i18n.setLocaleMessage(lang, msgs.default)
        loadedLanguages.push(lang)
        return setI18nLanguage(lang, msgs.default.dir)
      })
    } 
    return Promise.resolve(setI18nLanguage(lang, i18n.getLocaleMessage(lang).dir))
  }
  return Promise.resolve(lang)
}

// Register Components
import PrayerTimesList from './components/PrayerTimesList.vue';
Vue.component('prayer-times-list', PrayerTimesList);

import PrayerTimesSettings from './components/PrayerTimesSettings.vue';
Vue.component('prayer-times-settings', PrayerTimesSettings);

import AppLoader from './components/AppLoader.vue';
Vue.component('app-loader', AppLoader);

import Main from './components/Main.vue';
Vue.component('main-layout', Main);

import Clock from './components/Clock.vue';
Vue.component('clock', Clock);
// Load Page
import Home from './pages/Home.vue';
import Settings from './pages/Settings.vue';
import About from './pages/About.vue';

// Load style
import customless from "../assets/style/less/theme.less";
import customcss from '../assets/style/css/custom.css';
import UIkit from 'uikit';
import Icons from 'uikit/dist/js/uikit-icons';
UIkit.use(Icons);
Vue.prototype.$ui = UIkit;

// Maps 
import 'vue-googlemaps/dist/vue-googlemaps.css';
import VueGoogleMaps from 'vue-googlemaps';

Vue.use(VueGoogleMaps, {
  load: {
    // Google API key
    apiKey: process.env.GOOGLE_API_KEY,
    // Enable more Google Maps libraries here
    libraries: ['places'],
    // Use new renderer
    useBetaRenderer: false,
  },
});

// Router
const routes = [
  { path: '/', component: Home},
  { path: '/settings', component: Settings},
  { path: '/about', component: About},
  { path: '*', redirect: '/'}
];

const router = new VueRouter({
  routes
});

var app = new Vue({
  i18n,
  router,
  el: '#app',
  created: function () {
    loadLanguageAsync(settings.get("language"));
    ipcRenderer.on('events-channels-render', (event, arg) => {
      loadLanguageAsync(settings.get("language"));
    });
  }
});
