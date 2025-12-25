import { createApp } from 'vue'
import ArcoVue from '@arco-design/web-vue';
// import './style.css'
import '@arco-design/web-vue/dist/arco.css';
import ArcoVueIcon from '@arco-design/web-vue/es/icon';
import App from './App.vue'
// window.eyegaze_enable = true
const queryString = window.location.search;
const urlParams = new URLSearchParams(queryString);
const show = urlParams.get('show');
const start = urlParams.get("start");
const gaze = urlParams.get("eye");
window._showpoints = show=="true"?true:false;
window._startStep = start?parseInt(start):0;
window.eyegaze_enable = gaze=="false"?false:true;
const app = createApp(App);
app.use(ArcoVue);
app.use(ArcoVueIcon);
app.mount('#app');