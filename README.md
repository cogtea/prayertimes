# PrayerTimes
![Build PrayerTimes Electron](https://github.com/cogtea/prayertimes/workflows/Build%20PrayerTimes%20Electron/badge.svg?branch=master)

Desktop application built with electronjs.

!['mac screenshot'](screenshot/dev-day-2.png)

## Download

### macOS

Download [the latest release](https://github.com/cogtea/prayertimes/releases/download/1.0.0/PrayerTimes-1.0.0.dmg)

### windows/ linux

- [ ] TODO  test and build.

## Getting Started

```shell
npm install
npm run webpack
npm run electron
```

## Layout Structure 
It allow me to have a fullscreen window, or Page with shared content such sidemenu

[app.html]('src/render/layouts/app.html')

```
  <router-view>
     <Page>
        <Main>
           <Content>
        </Main>
     </Page>
     ..
     <Page>
        <Main>
           <Content>
        </Main>
     </Page>
  </router-view>
```
