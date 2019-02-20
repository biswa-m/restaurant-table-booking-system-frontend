import Vue from "vue";
import vueResource from "vue-resource";
import BootstrapVue from 'bootstrap-vue'

import App from "./App.vue";
import {router} from "./router";
import store from "./store";

import 'bootstrap/dist/css/bootstrap.css'
import 'bootstrap-vue/dist/bootstrap-vue.css'

Vue.config.productionTip = false;

Vue.use(vueResource);
Vue.use(BootstrapVue);

var vue = new Vue({
  el: '#app',
  router,
  store,
  render: function(h) {
		return h(App);
  }
});

// Intercept http requests
Vue.http.interceptors.push(function(request) {
	// return response callback
	return function(response) {
		// modify response
		if (response.status == 401 && response.body && response.body.errors && response.body.errors.message == 'jwt expired') {
			console.log('Token expired for: ', vue.$store.state.authenticated);
			if (vue.$store.state.authenticated == 'restaurant') {
				console.log('push rest');
				vue.$router.push('/restaurant/login');
			} else {
				console.log('push cust');
				vue.$router.push('/login');
			}
			vue.$store.commit('logout');
		}
  };
});
