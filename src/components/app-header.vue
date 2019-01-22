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
							<li class="nav-item dropdown">
								<a class="nav-link dropdown-toggle" href="https://example.com" id="dropdown04" data-toggle="dropdown" aria-haspopup="true" aria-expanded="false">Dropdown</a>
								<div class="dropdown-menu" aria-labelledby="dropdown04">
									<a class="dropdown-item" href="#">Action</a>
									<a class="dropdown-item" href="#">Another action</a>
									<a class="dropdown-item" href="#">Something else here</a>
								</div>
							</li>
							<li>
								<form class="form-inline my-2 my-md-0">
									<input class="form-control" type="text" placeholder="Search">
								</form>
							</li>
						</ul>
						<div class="nav-link">
							<router-link to="/restaurant/login">For Restauranteurs<span class="sr-only">(current)</span></router-link>
						</div>
						<div class="nav-link">
							<button id="login" @click="showLoginScreen">Login</button>
						</div>
					</div>
				</nav>
			</slot>
		</div>
	</div>
</template>

<script>
export default {
	methods: {
    showLoginScreen: function() {
      this.$store.commit('showLoginScreen')
    }
  }
}
</script>

<style>
</style>
