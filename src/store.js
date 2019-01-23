import Vue from "vue";
import Vuex from "vuex";

Vue.use(Vuex);

export default new Vuex.Store({
  state: {
		loginScreen: false,
		authenticated: false,
		user: {},
	},

	mutations: {
		showLoginScreen(state) {
			state.loginScreen = true;
		},
		hideLoginScreen(state) {
			state.loginScreen = false;
		},

		restaurantOwnerLogin(state, data) {
			state.authenticated = true;
			state.user = JSON.stringify(data.user);
		},

		logout(state) {
			state.user = {};
			state.authenticated = false;
		}
	},
  actions: {}
});
