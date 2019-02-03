<template>
	<div v-show="restaurants.length" class="container">
		<div class="row">
			<div v-for="restaurant in restaurants" class="col-xs-12 col-sm-6 col-md-4 col-lg-3 mx-auto">
				<router-link :to="'/'+restaurant.id" class="btn card">
					<img class="card-img-top" src="@/assets/image/restaurant1.jpeg" alt="photo of the restaurant">
					<div class="card-body">
						<h5 class="card-title">{{restaurant.name}}</h5>
						<p class="card-address" v-html="restaurant.address"></p>
					</div>
				</router-link>
			</div>
		</div>
	</div>
</template>

<script>
	export default {
		name: "restaurants",

		data() {
			return {
				restaurants: []
			}
		},
		methods: {
		},
		mounted() {
			this.$http.get(
				process.env.VUE_APP_API_ROUTE + 'restaurants'
			).then((response) => {
				console.log('response', response);
				if (response.ok && response.body.restaurants) {
					console.log('Restaurant list obtained');
					this.restaurants = response.body.restaurants;
				}
			}).catch((e) => {
				console.log(e);
			});
		}

	}
</script>

<style scoped>
	.container {
		padding: 10px;
		background: #777;
	}
	.card {
		height: 300px;
		margin-bottom: 25px;
	}
	.card-address {
		font-size: 10px;
	}
</style>
