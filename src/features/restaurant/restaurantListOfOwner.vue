<template>
	<div v-show="restaurants.length" class="container">
		<div>
			<h3>Restaurant List</h3>
		</div>
		<div class="restaturant-list">
			<ul>
				<li v-for="restaurant in restaurants">
					<a class="btn">
						{{restaurant.name}}<br>
						{{restaurant.id}}
					</a>
				</li>
			</ul>
		</div>
	</div>
</template>

<script>
	export default {
		name: "restaurant-list",

		data() {
			return {restaurants: ['a']}
		},

		mounted() {
			if (this.$store.state.authenticated != 'restaurant') return;

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
		}
	}
</script>

<style>
	.restaurant-list {
		text-align: left;
	}
</style>
