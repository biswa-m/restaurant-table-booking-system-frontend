<template>
	<div v-if="authenticated=='restaurant'"class="container" style="background:#fff">
		<div class="mt-3">
			<router-view :disabledDates="disabledDates" :key="$store.state.restaurant.id"></router-view>
		</div>
	</div>
</template>

<script>
	export default {
		name: "booking-restaurant",

		computed: {
			restaurantId() {
				return this.$store.state.restaurant.id;
			}
		},

		data () {
			return {
				disabledDates: null,
				authenticated: this.$store.state.authenticated,
				days: ['sunday', 'monday', 'tuesday', 'wednesday', 'thursday', 'friday', 'saturday']
			}
		},

		watch: {
			restaurantId() {
				this.updateDisabledDates();
			}
		},

		mounted() {
			this.updateDisabledDates();
		},

		methods: {
			updateDisabledDates() {
				// Disable past dates
				let disabledDates = {};
				disabledDates.to = new Date(new Date().setDate(new Date().getDate()-1));

				// Disable restaurant close days of a week
				let restaurant = this.$store.state.restaurant;
				let days = [];

				this.days.forEach(function(day, index) {
					if (restaurant.businessHours[day].end == 0) {
						days.push(index);
					}
				});
				disabledDates.days = days;
				this.disabledDates = disabledDates;
				console.log('Date disabled for bookings: ', this.disabledDates);
			}
		}
	}
</script>

<style>
</style>
