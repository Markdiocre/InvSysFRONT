import { createApp } from "vue";
import { createPinia } from "pinia";

import App from "./App.vue";
import router from "./router";
import 'bootstrap/dist/css/bootstrap.min.css'
import 'bootstrap'
import axios from 'axios'


const app = createApp(App);
axios.defaults.baseURL = 'http://localhost';

app.use(createPinia());
app.use(router);

app.mount("#app");
