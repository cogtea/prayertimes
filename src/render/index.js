import { createApp, onMounted } from 'vue';
import { createRouter, createWebHistory } from 'vue-router';
import { createI18n } from 'vue-i18n';

import Azan from './utilities/Azan.js';
import azanSound from '../assets/sound/azan.mp3';
import en from '../assets/i18n/en';
import ar from '../assets/i18n/ar';
import enFont from '../assets/i18n/fonts/en.ttf';
import arFont from '../assets/i18n/fonts/ar.ttf';

import Home from './pages/Home.vue';
import Settings from './pages/Settings.vue';
import About from './pages/About.vue';

import PrayerTimesList from './components/PrayerTimesList.vue';
import PrayerTimesSettings from './components/PrayerTimesSettings.vue';
import AppLoader from './components/AppLoader.vue';
import Main from './components/Main.vue';
import Clock from './components/Clock.vue';
import Location from './components/Location.vue';

import customless from "../assets/style/less/theme.less";
import customcss from '../assets/style/css/custom.css';
import UIkit from 'uikit';
import Icons from 'uikit/dist/js/uikit-icons';

import VueGoogleMaps from '@fawmi/vue-google-maps'

import eventBus from './utilities/EventBus.js';
const Store = window.electron.store;

import * as Sentry from "@sentry/electron/renderer";

Sentry.init({
    dsn: 'https://feec67241bf837a3c4b26daefd57630a@o4506450306990080.ingest.sentry.io/4506450308956160',
  });

const app = createApp({
    setup() {
        const prays = Azan.getPrays();
        const notifications = Azan.loadNotifications();
        let azanTimer = null;
        let azanAudio = null;

        const updateNotificationStatus = function (index, status) {
            notifications[index] = status;
            Azan.setNotificationStatus(index, status);
        };

        const getNextAzan = function (prays) {
            return Azan.getNextAzan(prays);
        };

        const checkForAzanNotification = function () {
            if (azanTimer) {
                clearTimeout(azanTimer);
            }
            azanTimer = setInterval(() => {
                const nextPray = Azan.checkAzanNotification(prays, notifications);
                if (nextPray !== false) {
                    const notification = new Notification(i18n.global.t('time_to_pray'), {
                        body: nextPray,
                        requireInteraction: true,
                        icon: '../../assets/icons/png/64x64.png',
                        badge: '../../assets/icons/png/64x64.png',
                    });

                    if (azanAudio == null) {
                        azanAudio = new Audio(azanSound);
                    }
                    azanAudio.currentTime = 0;
                    azanAudio.play();

                    notification.onclick = function (event) {
                        azanAudio.pause();
                        azanAudio.currentTime = 0;
                    };
                }
            }, 60 * 1000);
        };

        const getMainCssLinkIndex = function() {
            var elements = document.getElementsByTagName('link');
            for (var i = 0, length = elements.length; i < length; i++) {
              if (elements[i].href.indexOf('assets/css/app') >= 0) {
                  return i;
              }
            }
        };

        const setI18nLanguage = function() {
            let lang = Store.get("language", "en");

            var fontPath, direction;
            if (lang == 'ar') {
                fontPath = arFont;
                direction = 'rtl';
            } else {
                fontPath = enFont;
                direction = 'ltr';
            }
            
            i18n.global.locale = lang
            document.querySelector('html').setAttribute('lang', lang);
            if (document.getElementsByTagName('link').length > 0) {
                if (document.getElementsByTagName('link')[getMainCssLinkIndex()] != null) {
                    document.getElementsByTagName('link')[getMainCssLinkIndex()].href = document.getElementsByTagName('link')[getMainCssLinkIndex()].href.replace(document.querySelector('html').getAttribute('dir'), direction);
                }
            }
            document.querySelector('html').setAttribute('dir', direction);

            var fontFamily = 'Font-' + lang;
            var font = new FontFace(fontFamily, 'url(' + fontPath + ')');
            document.fonts.add(font);
            document.body.style.fontFamily = fontFamily;
            return lang;
        };

        onMounted(() => {
            checkForAzanNotification();
            setI18nLanguage();
            eventBus.on('updateSettings', () => {
                // Reload prays
                prays.value = Azan.getPrays();

                // Reload language
                setI18nLanguage();
            });
        });

        return {
            prays,
            notifications,
            updateNotificationStatus,
            getNextAzan,
            checkForAzanNotification,
            setI18nLanguage,
        };
    }
});

// Register components globally
app.component('prayer-times-list', PrayerTimesList);
app.component('prayer-times-settings', PrayerTimesSettings);
app.component('app-loader', AppLoader);
app.component('main-layout', Main);
app.component('clock', Clock);
app.component('location', Location);

// Router
const routes = [
    { path: '/', component: Home },
    { path: '/settings', component: Settings },
    { path: '/about', component: About },
    { path: '/:catchAll(.*)', redirect: '/' }
];

const router = createRouter({
    history: createWebHistory(),
    routes
});
app.use(router);

// Locale
let i18n = createI18n({
    locale: Store.get("language"),
    messages: {
        en: en,
        ar: ar,
    },
});
app.use(i18n);

// UIKIT
UIkit.use(Icons);
app.config.globalProperties.$ui = UIkit;

// Maps 
app.use(VueGoogleMaps, {
    load: {
        key: process.env.GOOGLE_API_KEY,
    },
})

// Mount the app
app.mount('#app');