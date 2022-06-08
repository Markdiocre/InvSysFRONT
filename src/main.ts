import { createApp } from "vue";
import { createPinia } from "pinia";

import App from "./App.vue";
import router from "./router";
import 'bootstrap/dist/css/bootstrap.min.css'
import 'bootstrap'
import axios from 'axios'

import { registerSW } from 'virtual:pwa-register'

const updateSW = registerSW({
  onNeedRefresh() {},
  onOfflineReady() {},
  immediate: true 
})

const app = createApp(App);
axios.defaults.baseURL = 'https://invsys-api.herokuapp.com/';
// axios.defaults.baseURL = 'http://127.0.0.1:8000/';

app.use(createPinia());
app.use(router);

app.mount("#app");
