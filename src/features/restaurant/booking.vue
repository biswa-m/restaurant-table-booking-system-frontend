<template>
	<div v-show="authenticated=='restaurant'"class="container" style="background:#fff">
		<div class="row list-table">
			<div v-show="error" class="alert alert-warning alert-dismissible mx-auto" role="alert">
				<strong>{{msg}}</strong>
			</div>
			<b-table responsive hover stacked="sm" :items="bookings" :fields="bookingFields" @row-clicked="toggleDetails">

				<template slot="bookingFrom" slot-scope="row">
					{{convertFormat(row.value)}}
				</template>

				<template slot="tables" slot-scope="row">
					{{row.value[0].tableIdentifier}}
				</template>

				<template slot="actions" slot-scope="row">
					<b-button v-if="row.item.bookingStatus!='canceled'" size="sm" @click.stop="changeBookingStatus('canceled', row.item)" class="btn-status">Cancel</b-button>
					<b-button v-if="row.item.bookingStatus=='pending'" size="sm" variant="success" @click.stop="changeBookingStatus('confirmed', row.item)" class="btn-status">Confirm</b-button>
				</template>

				<template slot="row-details" slot-scope="row">
					<b-card>
						<b-form @submit.prevent="updateTable(row.item, row.toggleDetails)" @reset="row.toggleDetails">
						</b-form>
					</b-card>
				</template>

			</b-table>
		</div>
	</div>
</template>

<script>
	export default {
		name: "tables",

		components: {
		},

		data () {
			this.getBookings();
			return {
				error: false,
				msg: '',
				authenticated: this.$store.state.authenticated,
				bookings: [],
				bookingFields: [
					{key: 'bookingFrom', label: 'Date'},
					{key: 'tables', label: 'Table'},
					{key: 'noOfPersons', label: 'Persons'},
					{key: 'bookingStatus', label: 'Status'},
					{key: 'actions', label: ''}
				]
			}
		},

		computed: {
			restaurantId() {
				return this.$store.state.restaurant.id;
			}
		},

		watch: {
			restaurantId() {
				this.getBookings();
			}
		},

		methods: {
			toggleDetails(a) {
				a._showDetails = !a._showDetails;
			},

			convertFormat(date) {
				return ((new Date(date)).toLocaleString());
			},

			changeBookingStatus(val, item) {
				this.$http.put(
					process.env.VUE_APP_API_ROUTE + 'restaurant/booking/' + this.restaurantId + '/' + item._id + '/status', 
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

			getBookings() {
				console.log('Getting bookings');
				this.$http.get(
					process.env.VUE_APP_API_ROUTE + 'restaurant/bookings/' + this.$store.state.restaurant.id,
					{
						headers: {
							Authorization: 'Bearer ' + JSON.parse(this.$store.state.user).token
						}
					}
				).then((response) => {
					console.log(response);
					if (response.ok && response.body.bookings) {
						// Add _showDetails key to toggle details on table
						this.bookings = response.body.bookings.map(x => {
							x._showDetails = false ;
							x._rowVariant = (x.bookingStatus == 'confirmed')
								? 'success'
								: (x.bookingStatus == 'canceled')
									? 'active'
									: 'warning';
							return x;
						});
						console.log('Bookings: ', (this.bookings));
					} else {
						this.error = true;
						this.msg = (response.body.errors && response.body.errors.message)
							? response.body.errors.message
							: "Could not get the bookings";
					}
				}).catch((e) => {
					this.error = true;
					this.msg = (e.body && e.body.errors && e.body.errors.message)
						? e.body.errors.message
						: "Could not get the bookings";
					console.log(JSON.stringify(e));
				});
			}
		}
	}
</script>

<style>
.list-table {
	margin-top: 20px;
}
.fa-trash {
	color: #eaa;
}
.btn-status {
font-size: 10px;
padding: 3px;
margin: 1px;
}
</style>
