import { createApp, App } from './app';

let currentApp: App

createApp().then(app => {
  currentApp = app
}).catch(console.log)