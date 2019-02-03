<template>
	<div class="container">
		<restaurantList/>
	</div>
</template>

<script>
	import restaurants from "@/features/customer/restaurantList.vue"
	export default {
		name: "home",

		components: {
			restaurantList: restaurants
		}
	}
</script>

<style scoped>
</style>
