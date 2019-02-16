import Vue from "vue";
import Vuex from "vuex";
import createPersistedState from 'vuex-persistedstate'

Vue.use(Vuex);

export default new Vuex.Store({
  plugins: [createPersistedState()],

  state: {
		authenticated: false,
		user: {},
		restaurant: {id: '', name: ''}
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
			state.restaurant = {id: '', name: ''};
		},
		selectRestaurant(state, restaurant) {
			if (!restaurant || !restaurant.id || !restaurant.name)
				return console.log('Error: No restaurant selected');
			state.restaurant= {
				id: restaurant.id,
				name: restaurant.name,
				businessHours: restaurant.businessHours
			}
		}
	},
  actions: {}
});
