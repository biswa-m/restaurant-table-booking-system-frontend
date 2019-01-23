import Vue from "vue";
import Vuex from "vuex";

Vue.use(Vuex);

export default new Vuex.Store({
  state: {
		loginScreen: false,
		user: {
			firstName: '',
			lastName: '',
			email: '',
			token: ''
		}
	},

	mutations: {
		showLoginScreen(state) {
			state.loginScreen = true;
		},
		hideLoginScreen(state) {
			state.loginScreen = false;
		},

		restaurantOwnerLogin(state, data) {
			state.user.firstName = JSON.stringify(data.user.firstName);
			state.user.lastName = JSON.stringify(data.user.lastName);
			state.user.email = JSON.stringify(data.user.email);
			state.user.token = JSON.stringify(data.user.token);
		}
	},
  actions: {}
});
