<template>
	<div class="header">
		<div class="header-container">
			<slot name="navbar">
				<router-link to="/">Home</router-link> |
				<button id="login" @click="showLoginScreen">Login</button>
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
