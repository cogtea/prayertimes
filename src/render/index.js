import Vue from 'vue';
import VueRouter from 'vue-router';
Vue.use(VueRouter);

// Main
// const { ipcRenderer, remote } = require('electron');
// const settings = require('electron-settings');

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

// function setI18nLanguage(lang, direction, fontEncoded) {
//     i18n.locale = lang;
//     document.querySelector('html').setAttribute('lang', lang);
//     if (document.getElementsByTagName('link').length > 0) {
//         if (document.getElementsByTagName('link')[getMainCssLinkIndex()] != null) {
//             document.getElementsByTagName('link')[getMainCssLinkIndex()].href = document.getElementsByTagName('link')[getMainCssLinkIndex()].href.replace(document.querySelector('html').getAttribute('dir'), direction);
//         }
//     }
//     document.querySelector('html').setAttribute('dir', direction);

//     var fontFamily = 'Font-' + lang;
//     var font = new FontFace(fontFamily, 'url(' + fontEncoded.default + ')');
//     document.fonts.add(font);

//     document.body.style.fontFamily = fontFamily;

//     return lang;
// }

// // Lazy load language
// export function loadLanguageAsync(lang) {
//     if (i18n.locale !== lang) {
//         if (!loadedLanguages.includes(lang)) {
//             return import(/* webpackChunkName: "lang-[request]" */ `../assets/i18n/${lang}`).then(msgs => {
//                 i18n.setLocaleMessage(lang, msgs.default)
//                 loadedLanguages.push(lang)
//                 var font = msgs.default.font_family;
//                 import(/* webpackChunkName: "lang-font-[request]" */ `../assets/i18n/fonts/${font}`).then(font => {
//                     return setI18nLanguage(lang, msgs.default.dir, font)
//                 })
//             })
//         }
//         var msgs = i18n.getLocaleMessage(lang);
//         var font = msgs.font_family;
//         import(/* webpackChunkName: "lang-font-[request]" */ `../assets/i18n/fonts/${font}`).then(font => {
//             return setI18nLanguage(lang, msgs.dir, font)
//         })
//     }
//     return Promise.resolve(lang)
// }

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

import location from './components/Location.vue';
Vue.component('location', location);
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
import * as VueGoogleMaps from 'vue2-google-maps';

Vue.use(VueGoogleMaps, {
    load: {
        // Google API key
        key: process.env.GOOGLE_API_KEY,
        // Enable more Google Maps libraries here
        libraries: ['places'],
        // Use new renderer
        //useBetaRenderer: false,
    },
});

// Router
const routes = [
    { path: '/', component: Home },
    { path: '/settings', component: Settings },
    { path: '/about', component: About },
    { path: '*', redirect: '/' }
];

const router = new VueRouter({
    routes
});

// Instance
import Azan from './utilities/Azan.js';
import azanSound from '../assets/sound/azan.mp3';
var app = new Vue({
    i18n,
    router,
    el: '#app',
    data: {
        prays: Azan.getPrays(),
        notifications: Azan.loadNotifications(),
        azanTimer: null,
        azanAudio: null,
        azanNext: null,
    },
    created: function () {
        // loadLanguageAsync(settings.get("language"));
        // ipcRenderer.on('events-channels-render', (event, arg) => {
        //     loadLanguageAsync(settings.get("language"));
        // });
        this.checkForAzanNotification();
    },
    methods: {
        updateNotificationStatus: function (index, status) {
            this.notifications[index] = status;
            Vue.set(this.notifications, index, status);
            Azan.setNotificationStatus(index, status);
        },
        getNextAzan: function (prays) {
            return Azan.getNextAzan(prays);
        },
        checkForAzanNotification: function () {
            var self = this;
            if (this.azanTimer) {
                clearTimeout(this.azanTimer)
            }
            this.azanTimer = setInterval(function () {
                var nextPray = Azan.checkAzanNotification(self.prays, self.notifications);
                if (nextPray !== false) {
                    var notification = new Notification('Time to Pray', {
                        body: nextPray,
                        requireInteraction: true
                    });

                    if (self.azanAudio == null) {
                        self.azanAudio = new Audio(azanSound);
                    }
                    self.azanAudio.currentTime = 0;
                    self.azanAudio.play();

                    notification.onclick = function (event) {
                        self.azanAudio.pause();
                        self.azanAudio.currentTime = 0;
                    };
                }
            }, 60 * 1000);
        }
    }
});
