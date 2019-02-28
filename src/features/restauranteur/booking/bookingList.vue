<template>
	<b-table responsive hover
					stacked="sm"
					:items="bookings"
					:fields="bookingFields"
					@row-clicked="toggleDetails">
		<template slot="bookingFrom" slot-scope="row">
			{{convertFormat(row.value)}}
		</template>
		<template slot="tables" slot-scope="row">
			{{row.value[0].tableIdentifier}}
		</template>
		<template slot="cancel" slot-scope="row">
			<b-button v-if="row.item.bookingStatus!='canceled'"
								size="lg"
								class="btn-status btn-block"
								@click.stop="changeBookingStatus('canceled', row.item)">
				Cancel
			</b-button>
		</template>
		<template slot="confirm" slot-scope="row">
			<b-button v-if="row.item.bookingStatus=='pending'"
								size="lg"
								variant="success"
								@click.stop="changeBookingStatus('confirmed', row.item)"
								class="btn-status btn-block">
				Confirm
			</b-button>
		</template>
		<template slot="row-details" slot-scope="row">
			<row-details :row="row"
									:disabledDates="disabledDates"
									:days="days"
									:restaurant="restaurant">
			</row-details>
		</template>
	</b-table>
</template>

<script>
	import rowDetails from "@/features/restauranteur/booking/bookingDetails.vue";

	export default {
		name: "booking-list",

		components: {
			'row-details': rowDetails 
		},

		props: ['bookings', 'disabledDates', 'restaurant'],

		data() {
			return {
				bookingFields: [
					{key: 'bookingFrom', label: 'Date'},
					{key: 'tables', label: 'Table'},
					{key: 'noOfPersons', label: 'Persons'},
					{key: 'bookingStatus', label: 'Status'},
					{key: 'confirm', label: ''},
					{key: 'cancel', label: ''}
				],
				days: ['sunday', 'monday', 'tuesday', 'wednesday', 'thursday', 'friday', 'saturday']
			}
		},

		methods: {
			toggleDetails(a) {
				a._showDetails = !a._showDetails;
				
				// Get customer details if not present 
				if (!Object.values(a.customerDetails).length) {
					this.customerDetails({id: a.customer}, a);

					// Set new reactive vue properties
					this.$set(a, 'edit', false);
					console.log(a);
				}
			},

			convertFormat(date) {
				return ((new Date(date)).toLocaleString());
			},

			changeBookingStatus(val, item) {
				this.$http.put(
					process.env.VUE_APP_API_ROUTE + 'restaurant/booking/' + this.restaurant.id + '/' + item._id + '/status', 
					{
						booking: {bookingStatus: val}
					},
					{
						headers: {
							Authorization: 'Bearer ' + JSON.parse(this.$store.state.user).token
						}
					}
				).then((response) => {
					console.log(response);
					if (response.ok && response.body.booking) {
						item.bookingStatus = response.body.booking.bookingStatus;
						item._rowVariant = (item.bookingStatus == 'confirmed')
							? 'success'
							: (item.bookingStatus == 'canceled')
								? 'active'
								: 'warning';
					}
				}).catch((e) => {
					console.log('Error during booking status updation');
				});
			},

			customerDetails(params, output) {
				console.log('Getting customer details: ', JSON.stringify(params));
				this.$http.get(
					process.env.VUE_APP_API_ROUTE + 'restaurant/' + this.$store.state.restaurant.id + '/customer',
					{
						params,
						headers: {
							Authorization: 'Bearer ' + JSON.parse(this.$store.state.user).token
						}
					}
				).then((response) => {
					console.log(response);
					if (response.ok && response.body.customer) {
						output.customerDetails = response.body.customer;
					} else {
						this.error = true;
						this.msg = (response.body.errors && response.body.errors.message)
							? response.body.errors.message
							: "Could not get the customer details";
					}
				}).catch((e) => {
					this.error = true;
					this.msg = (e.body && e.body.errors && e.body.errors.message)
						? e.body.errors.message
						: "Could not get the customer Details";
					console.log(JSON.stringify(e));
				});
			},
		}
	}
</script>

<style scoped>
.btn-status {
	height: 100%;
	min-height: 35px;
}
</style>
