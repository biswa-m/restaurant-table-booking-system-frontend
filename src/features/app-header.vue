<template>
	<div class="header">
		<div class="header-container">
			<slot name="navbar">
				<nav class="navbar navbar-expand-md navbar-dark bg-dark">
					<a class="navbar-brand" href="#">TableBooking</a>
					<button class="navbar-toggler" type="button" data-toggle="collapse" data-target="#headerNavbar" aria-controls="headerNavbar`" aria-expanded="false" aria-label="Toggle navigation">
						<span class="navbar-toggler-icon"></span>
					</button>

					<div class="collapse navbar-collapse" id="headerNavbar">
						<ul class="navbar-nav mr-auto">
							<li class="nav-item active">
								<div class="nav-link">
									<router-link to="/">Home<span class="sr-only">(current)</span></router-link>
								</div>
							</li>
						</ul>
						<div  class="nav-link">
							<router-link to="/restaurant">For Restauranteurs<span class="sr-only">(current)</span></router-link>
						</div>
						<div v-show="!$store.state.authenticated" class="nav-link">
							<button id="login" @click="showLoginScreen">Login</button>
						</div>
						<div v-show="$store.state.authenticated" class="nav-link">
							<button id="logout" @click="logout">Logout</button>
						</div>
					</div>
				</nav>
			</slot>
		</div>
		<loginScreen v-show="loginScreen" @close="hideLoginScreen"></loginScreen>
	</div>
</template>

<script>
import loginScreen from "@/features/login.vue"

export default {
	data() {
		return {
			loginScreen: false,
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
		}
  },

	components: {
		loginScreen: loginScreen
	}
}
</script>

<style>
.header {
  position: fixed;
	z-index: 10;
  left: 0;
  width: 100%;
  transition-delay: 0.3s;
}

</style>
