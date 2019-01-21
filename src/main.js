import Vue from "vue";
import App from "./App.vue";
import router from "./router";
import store from "./store";

Vue.config.productionTip = false;

var vue01 = new Vue({
  el: '#app',
  router,
  store,
  render: function(h) {
	return h(App);
  }
});
