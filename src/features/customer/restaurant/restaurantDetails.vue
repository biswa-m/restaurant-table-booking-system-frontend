<template>
	<div class="container wrapper">
		<div class="main-div" v-if="restaurant != 'notFound'">
			<div class="restaurant">
				<div class="row">
					<div class="col-md-6">
						<img class="restaurant-photo mx-auto"src="@/assets/image/restaurant1.jpeg">
					</div>
					<div class="restaurant-details col-md-6">
							<h4 class="title">{{restaurant.name}}</h4>
							<p class="description" v-html="restaurant.description"></p>
							<p class="address" v-html="restaurant.address"></p>
					</div>
				</div>
			</div>
			<div class="booking">
				<initiate-booking :restaurant="restaurant"/>
			</div>
		</div>
		<div v-if="restaurant == 'notFound'">
			<notFound/>
		</div>
	</div>
</template>

<script>
	import initiateBooking from "@/features/customer/booking/initBooking.vue"

	export default {
		data() {
			return {
				restaurant:{}
			};
		},

		components: {
			'initiate-booking': initiateBooking,
			'notFound': () => import(/* webpackChunkName: "notFound-404" */ "@/features/pageNotFound.vue")
		},

		beforeMount() {
			this.$http.get(
				process.env.VUE_APP_API_ROUTE + 'restaurants?restaurantid=' + this.$route.params.restaurant
			).then((response) => {
				if (response.ok && response.body.restaurants) {
					this.restaurant = response.body.restaurants[0];
					console.log('restaurant: ', JSON.stringify(this.restaurant));
				}
			}).catch((e) => {
				console.log(e);
				this.restaurant = 'notFound'
			});
		}
	}
</script>

<style scoped>
.wrapper {
	position: relative;
}
.parent {
	position: absolute;
}
.restaurant {
	margin: 15px;
	padding: 20px;
	border-style: solid;
	border-color: #bbb;
	border-radius: 18px;
	border-width: 3px;
	background: #fff;
}
.restaurant .border {
	border: 4px !important;
}
.restaurant-photo {
	width: 100%
}
.restaurant-details {
	text-align: left;
	padding: 15px;
}
.restaurant-details p {
	font-size: 14px;
}
.booking {
	margin: 15px;
	padding: 20px 10% 20px 10%;
	border-style: solid;
	border-color: #bbb;
	border-radius: 18px;
	border-width: 1px;
	background: #fff;
}
</style>
