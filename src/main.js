import Vue from "vue";
import vueResource from "vue-resource";
import BootstrapVue from 'bootstrap-vue'

import App from "./App.vue";
import router from "./router";
import store from "./store";

import 'bootstrap/dist/css/bootstrap.css'
import 'bootstrap-vue/dist/bootstrap-vue.css'

Vue.config.productionTip = false;

Vue.use(vueResource);
Vue.use(BootstrapVue);

new Vue({
  el: '#app',
  router,
  store,
  render: function(h) {
		return h(App);
  }
});
