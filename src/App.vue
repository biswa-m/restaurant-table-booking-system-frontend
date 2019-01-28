<template>
  <div id="app">
		<defaultLayout/>
		<div class="router-view">
			<router-view/>
		</div>
  </div>
</template>

<script>
import defaultLayout from '@/layout/main.vue';

export default {
	name: "app",
	components: {
		defaultLayout
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
