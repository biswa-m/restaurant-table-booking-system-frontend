<template>
	<div v-show="authenticated=='restaurant'"class="container" style="background:#f5f5f5">
		<div class="row">
			<div class="restaurant restaurant-add">
				<router-link to="/restaurant/add" class="btn btn-lg btn-primary">Add restaurant</router-link>
			</div>
		</div>
		<div class="row">
			<restaurantList/>
		</div>
	</div>
</template>

<script>
	import restaurantList from '@/features/restaurant/restaurantListOfOwner.vue';

	export default {
		name: "restaurat-owner-homepage",

		components: {
			restaurantList
		},

		data() {
			return {
				authenticated: this.$store.state.authenticated
			}
		},
	}
</script>

<style>
.restaurant-add {
	padding:100px 0 100px 0;
	margin:0px;
	width:100%;
	text-align: center;
}
</style>
