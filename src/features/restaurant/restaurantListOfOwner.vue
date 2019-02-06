<template>
	<div v-show="restaurants.length" class="container">
		<div class="row">
			<div class="col-md-8 mx-auto">
				<div class="restaurant-list">
					<h3>Restaurant List</h3>
					<div class="list-group">
						<div v-for="restaurant in restaurants">
							<a @click="selectRestaurant(restaurant)" v-bind:class="verification(restaurant.verified)">
								{{restaurant.name}}
							</a>
							<div class="restaurant-details list-group-item
									list-group-item-action flex-column align-items-start">
									<div v-show="!restaurant.verified" class="alert-warning ">
										<small>This restaurant is not verified yet</small>
									</div>
								<div class="row">
									<span v-html="restaurant.description"></span>
								</div>
								<div class="row">
									<div class="col-md-9 mx-auto">
										<h5>Address</h5>
										<span v-html="multiline(restaurant.address)"></span>
									</div>
								</div>
							</div>
						</div>
					</div>
				</div>
			</div>
		</div>


	</div>
</template>

<script>
	export default {
		name: "restaurant-list",

		data() {
			return {
				restaurants: []
			}
		},

		methods: {
			selectRestaurant(restaurant) {
				this.$store.commit('selectRestaurant', restaurant);
				this.$router.push("/restaurant/" + restaurant.id);
			},
			multiline(value) {
				return JSON.parse(JSON.stringify(value).replace(/\\n/gi, "<br/>"));
			},
			verification(value) {
				return value
					? "btn btn-outline-success btn-block btn-restaurant":
					"btn btn-outline-secondary btn-block btn-restaurant";
			}
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
.btn-restaurant {
	margin-top:40px;
}
</style>
