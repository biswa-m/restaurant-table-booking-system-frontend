<template>
	<div class="header">
		<div class="header-container">
			<slot name="navbar">
				<nav class="navbar fixed-top navbar-expand-sm navbar-dark bg-dark">
					<router-link to="/" class="navbar-brand">TableBooking</router-link>
					<button class="navbar-toggler" type="button" data-toggle="collapse" data-target="#headerNavbar" aria-controls="headerNavbar`" aria-expanded="false" aria-label="Toggle navigation">
						<span class="navbar-toggler-icon"></span>
					</button>

					<div class="collapse navbar-collapse" id="headerNavbar">
						<ul class="navbar-nav mr-auto">
							<li class="nav-item active">
							</li>
						</ul>
						<router-link to="/restaurant" v-if="!$store.state.authenticated">
							<div class="nav-link nav-router">
								For Restauranteurs
							</div>
						</router-link>
						<div v-if="$store.state.authenticated=='restaurant'" class="restaurant-selector">
								<b-dropdown variant="outline-info noBtnStyle" menuClass="btn" no-caret>
								<template slot="button-content">
									<span @click="getRestaurants" class="dd-title">{{((this.$store.state.restaurant.name	|| 'Select Restaurant'))}}
									<i class="fas fa-caret-down" aria-hidden="true"></i></span>
								</template>
								<div v-for="restaurant in restaurants">
									<b-dropdown-item @click="selectRestaurant(restaurant)">{{restaurant.name}}</b-dropdown-item>
								</div>
							</b-dropdown>
						</div>
						<div v-show="!$store.state.authenticated" class="">
							<button class="btn btn-outline-light" id="login" @click="showLoginScreen">Login</button>
						</div>
						<div v-if="$store.state.authenticated" class="dropdown">
							<b-dropdown variant="outline-light">
								<template slot="button-content">
									<i class="fa fa-user" aria-hidden="true"></i>
									{{((JSON.parse(this.$store.state.user).name
									|| JSON.parse(this.$store.state.user).firstName
									|| 'My Account')+ ' ')}}
								</template>
								<b-dropdown-item v-if="$store.state.authenticated=='restaurant'"
									@click="$router.push('/restaurant/' + $store.state.restaurant.id)">Dashboard</b-dropdown-item>
								<b-dropdown-item v-if="$store.state.authenticated=='restaurant'"
									@click="$router.push('/restaurant/' + $store.state.restaurant.id + '/booking')">Bookings</b-dropdown-item>
								<b-dropdown-item v-if="$store.state.authenticated=='restaurant'"
									@click="$router.push('/restaurant/')">Restaurants</b-dropdown-item>
								<b-dropdown-item v-if="$store.state.authenticated=='restaurant'"
									@click="$router.push('/restaurant/' + $store.state.restaurant.id + '/tables')">Tables</b-dropdown-item>
								<b-dropdown-item v-if="$store.state.authenticated=='customer'">Profile</b-dropdown-item>
								<b-dropdown-item v-if="$store.state.authenticated=='customer'">Bookings</b-dropdown-item>
								<b-dropdown-divider></b-dropdown-divider>
								<b-dropdown-item @click="logout">Logout</b-dropdown-item>
							</b-dropdown>
						</div>
					</div>
				</nav>
			</slot>
		</div>
		<loginScreen v-show="loginScreen" @close="hideLoginScreen"></loginScreen>
	</div>
</template>

<script>
import loginScreen from "@/features/customer/login/dialog.vue"

export default {
	data() {
		return {
			loginScreen: false,
			restaurants: []
		}
	},

	methods: {
    showLoginScreen: function() {
			this.loginScreen = true;
    },
    hideLoginScreen: function() {
			this.loginScreen = false;
    },
		logout: function() {
			this.$store.commit('logout');
			this.$router.push('/');
		},
		getRestaurants() {
			console.log('Getting Restaurants of the user');
			this.$http.get(
				process.env.VUE_APP_API_ROUTE + 'restaurant/',
				{
					headers: {
						Authorization: "Bearer "+ JSON.parse(this.$store.state.user).token
					}
				}
			).then((response) => {
				console.log('response', response);
				if (response.ok) {
					this.restaurants = response.body.restaurants;
				}
			}).catch((e) => {
				console.log(e);
			});
		},
		selectRestaurant(restaurant) {
			this.$store.commit('selectRestaurant', restaurant);
		}
  },

	components: {
		loginScreen: loginScreen
	}
}
</script>

<style>
.header {
  left: 0;
  width: 100%;
}
.nav-router {
	font-size: 14px;
	color: #8adeb9;
	margin: 0 15px 0 3px;
}
.nav-router:hover {
	text-decoration: underline !important;
	color: #2bd489;
}
.user-dropdown {
	right: 0;
	left: auto !important;
}
.user-dropdown a {
	padding: 5px 10px 5px 25px;
}
.user-dropdown a:hover {
	background: #ddd;
}
.user-dropdown hr {
	margin: 0;
}
.restaurant-selector {
	margin: 0 5% 0 5%;
}
.noBtnStyle {
	padding: 0 !important;
	border-style: none !important;
}
.noBtnStyle:hover {
	background-color: transparent !important;
}
.noBtnStyle:focus {
	box-shadow: none !important;
}
.dd-title {
	padding: 10px;
}
</style>
