<template>
  <div id="app">
		<appHeader/>
		<div class="router-view">
			<router-view/>
		</div>
  </div>
</template>

<script>
import appHeader from "@/features/app-header.vue"

export default {
	name: "app",
	components: {
		appHeader
	}
}
</script>

<style>
#app {
  font-family: "Avenir", Helvetica, Arial, sans-serif;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  text-align: center;
  color: #2c3e50;
}
.router-view {
	padding-top: 64px;
}
</style>
