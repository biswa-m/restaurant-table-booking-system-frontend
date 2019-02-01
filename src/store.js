import Vue from "vue";
import Vuex from "vuex";
import createPersistedState from 'vuex-persistedstate'

Vue.use(Vuex);

export default new Vuex.Store({
  plugins: [createPersistedState()],

  state: {
		authenticated: false,
		user: {}
	},

	mutations: {
		restaurantOwnerLogin(state, data) {
			state.authenticated = 'restaurant';
			state.user = JSON.stringify(data.user);
		},

		customerLogin(state, data) {
			state.authenticated = 'customer';
			state.user = JSON.stringify(data.user);
		},

		logout(state) {
			state.user = {};
			state.authenticated = false;
		}
	},
  actions: {}
});
