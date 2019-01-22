import Vue from "vue";
import Vuex from "vuex";

Vue.use(Vuex);

export default new Vuex.Store({
  state: {
		loginScreen: false
	},
  mutations: {
		showLoginScreen(state) {
			state.loginScreen = true;
		},
		hideLoginScreen(state) {
			state.loginScreen = false;
		}
	},
  actions: {}
});
