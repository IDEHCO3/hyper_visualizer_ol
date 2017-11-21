// The Vue build version to load with the `import` command
// (runtime-only or standalone) has been set in webpack.base.conf with an alias.
import Vue from 'vue';
import Vuetify from 'vuetify';
import App from './App';
import ol from 'openlayers';
import geojsonVt from 'geojson-vt';
import('../node_modules/vuetify/dist/vuetify.min.css') // Ensure you are using css-loader
import axios from 'axios';

Vue.config.productionTip = false;
Vue.use(Vuetify);
Vue.use(ol);

export const bus = new Vue();
/* eslint-disable no-new */
new Vue({
  el: '#app',
  template: '<App/>',
  components: { App }
})
