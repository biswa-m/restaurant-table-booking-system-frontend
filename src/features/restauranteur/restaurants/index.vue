<template>
	<div v-show="authenticated=='restaurant'"class="container" style="background:#f5f5f5">

		<div class="row">
			<div v-for="restaurant in restaurants" class="col-xs-12 col-sm-6 col-md-4 col-lg-3 mx-auto">
				<div class="card">
					<a @click="selectRestaurant(restaurant)" v-bind:class="verification(restaurant.verified)">
						<b>
							{{restaurant.name}}
						</b>
						<div class="card-body p-1">
							<div v-show="!restaurant.verified" class="alert-warning ">
								<small>This restaurant is not verified</small>
							</div>
							<div v-html="restaurant.description">
							</div>
							<div class="address">
								<div class="text-left">
									<b>Address</b><br/>
									<div class="address-body">
										<small v-html="multiline(restaurant.address)"></small>
									</div>
								</div>
							</div>
						</div>
					</a>
				</div>
			</div>
			<div class="col-xs-12 col-sm-6 col-md-4 col-lg-3 mx-auto">
				<div class="card">
					<a @click="$router.push('/restaurant/add')" class="btn btn-outline-primary h-100">
						<img class="card-img-top mx-auto" src="@/assets/image/add.png" alt="photo of the restaurant">
						<div class="card-body">
							<h4>Add Restaurant</h4>
						</div>
					</a>
				</div>
			</div>
		</div>
	</div>
</template>

<script>
	export default {
		name: "restaurant-list-of-owner",

		data() {
			return {
				authenticated: this.$store.state.authenticated,
				restaurants: []
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
		},

		methods: {
			selectRestaurant(restaurant) {
				this.$store.commit('selectRestaurant', restaurant);
				this.$router.push("/restaurant/");
			},
			multiline(value) {
				return JSON.parse(JSON.stringify(value).replace(/\\n/gi, "<br/>"));
			},
			verification(value) {
				return value
					? "btn btn-outline-success btn-block btn-restaurant h-100":
					"btn btn-outline-secondary btn-block btn-restauranti h-100";
			}
		}
	}
</script>

<style scoped>
	.restaurant-add {
		padding:100px 0 100px 0;
		margin:0px;
		width:100%;
		text-align: center;
	}
	.card {
		height: 300px;
		box-shadow: 0 4px 8px 0 rgba(0, 0, 0, 0.2), 0 6px 20px 0 rgba(0, 0, 0, 0.19);
		margin-bottom: 25px;
		max-width: 300px;
	}
	.card:hover {
		color: white;
	}
	.card-address {
		font-size: 10px;
	}
	.card-img-top {
		max-height: 200px;
		max-width: 95%;
	}
	.address {
		position: absolute;
		top: 160px;
	}
	.address-body {
		max-height: 100px;
		overflow: auto;
	}
</style>
