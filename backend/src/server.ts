import { App, createApp } from './app'

let currentApp: App

createApp().then(app => {
    currentApp = app
}).catch(console.log)