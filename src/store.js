import Vue from "vue";
import Vuex from "vuex";
import createPersistedState from 'vuex-persistedstate'

Vue.use(Vuex);

export default new Vuex.Store({
  plugins: [createPersistedState()],

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
			state.authenticated = 'restaurant';
			state.user = JSON.stringify(data.user);
		},

		logout(state) {
			state.user = {};
			state.authenticated = false;
		}
	},
  actions: {}
});
