<template>
	<div>
		<b-row>
			<b-col sm=4>
				<a class="btn card" @click="$store.commit('selectBookingList', 'All bookings'); $router.push('/restaurant/booking')">
					<div class="card-title">
						All Bookings
						<hr>
					</div>
					<p class="">{{allBookings}}</p>
				</a>
			</b-col>
			<b-col sm=4>
				<a class="btn card" @click="$store.commit('selectBookingList', 'Upcoming bookings'); $router.push('/restaurant/booking')">
					<div class="card-title">
						Upcoming Bookings
						<hr>
					</div>
					<p class="">{{upcomingBookings}}</p>
				</a>
			</b-col>
			<b-col sm=4>
				<a class="btn card" @click="$store.commit('selectBookingList', 'Past bookings'); $router.push('/restaurant/booking')">
					<div class="card-title">
						Past Bookings
						<hr>
					</div>
					<p class="">{{pastBookings}}</p>
				</a>
			</b-col>
		</b-row>

		<hr/>
		<div class="mb-2">
			<u>Upcoming Bookings</u>
		</div>
		<b-row>
			<b-col sm=4>
				<a class="btn card"
					@click="$store.commit('selectBookingList', 'Upcoming bookings');
									$store.commit('bookingStatus', ['pending']);
									$router.push('/restaurant/booking');">
					<div class="card-title">
						Pending Bookings
						<hr>
					</div>
					<p class="">{{upcoming.pending}}</p>
				</a>
			</b-col>
			<b-col sm=4>
				<a class="btn card"
					@click="$store.commit('selectBookingList', 'Upcoming bookings');
									$store.commit('bookingStatus', ['confirmed']);
									$router.push('/restaurant/booking');">
					<div class="card-title">
						Confirmed Bookings
						<hr>
					</div>
					<p class="">{{upcoming.confirmed}}</p>
				</a>
			</b-col>
			<b-col sm=4>
				<a class="btn card"
					@click="$store.commit('selectBookingList', 'Upcoming bookings');
									$store.commit('bookingStatus', ['canceled']);
									$router.push('/restaurant/booking');">
					<div class="card-title">
						Canceled Bookings
						<hr>
					</div>
					<p class="">{{upcoming.canceled}}</p>
				</a>
			</b-col>
		</b-row>
	</div>
</template>

<script>
	export default {
		name: "statistic",

		data() {
			return {
				allBookings: null,
				upcomingBookings: null,
				pastBookings: null,
				upcoming: {
					canceled: null,
					confirmed: null,
					pending: null
				},
				all: {
					canceled: null,
					confirmed: null,
					pending: null
				},
				past: {
					canceled: null,
					confirmed: null,
					pending: null
				},
			}
		},

		mounted() {
			// Fetch the booking counts

			this.getBookings({}, this, 'allBookings')

			this.getBookings({
				before: null,
				after: (new Date()).getTime()
			}, this, 'upcomingBookings')

			this.getBookings({
				before: (new Date()).getTime(),
				after: null
			}, this, 'pastBookings')

			// booking counts of upcoming booking, bookingStatus wise
			this.getBookings({
				before: null,
				after: (new Date()).getTime(),
				bookingStatus: 'pending'
			}, this.upcoming, 'pending')

			this.getBookings({
				before: null,
				after: (new Date()).getTime(),
				bookingStatus: 'confirmed'
			}, this.upcoming, 'confirmed')

			this.getBookings({
				before: null,
				after: (new Date()).getTime(),
				bookingStatus: 'canceled'
			}, this.upcoming, 'canceled')
		},

		methods: {
			getBookings(params, obj, key) {
				params.countOnly = true;
				this.$http.get(
					process.env.VUE_APP_API_ROUTE + 'restaurant/bookings/' + this.$store.state.restaurant.id,
					{
						params,
						headers: {
							Authorization: 'Bearer ' + JSON.parse(this.$store.state.user).token
						}
					}
				).then((response) => {
					console.log(response);
					obj[key] = response.body.count;
				}).catch((e) => {
					console.log(JSON.stringify(e));
				});
			},
		
	}
}
</script>

<style scoped>
	.card {
		box-shadow: 0 4px 8px 0 rgba(0, 0, 0, 0.2), 0 6px 20px 0 rgba(0, 0, 0, 0.19);
		margin-bottom: 25px;
		border-radius: 5px;
	}
</style>
