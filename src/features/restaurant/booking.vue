<template>
	<div v-if="authenticated=='restaurant'"class="container" style="background:#fff">
		<div class="mt-3 booking-list-restauranteur">
			<h3 class="text-left">
				<small>{{selectedList}} of </small>
				<b>{{$store.state.restaurant.name}}</b>
			</h3>
			<div v-show="error" class="alert alert-warning alert-dismissible mx-auto" role="alert">
				<strong>{{msg}}</strong>
			</div>
			<hr>
			<div class="row mr-1">
				<div class="ml-auto">
					<button class="btn btn-outline-info btn-sm"
									@click="showFilter=!showFilter">
						Filter Bookings
						<i class="fa fa-caret-down" aria-hidden="true"></i>
					</button>
				</div>
			</div>
			<transition name="slide">
				<div v-show="showFilter" class="row">
					<div class="pt-1 pb-2 w-100 mx-3">
						<b-card header="Filter" title="">
							<div class="row">
								<div class="col-sm-3 text-left text-sm-right">
									<b>Status:</b>
								</div>
								<div class="col-sm-9">
									<b-form-checkbox-group v-model="params.bookingStatus"
										:options="['pending', 'confirmed', 'canceled']">
									</b-form-checkbox-group>
								</div>
							</div>
							<div class="row">
								<b-button variant="primary btn-sm ml-auto mr-3 mt-3"
													@click="getBookings(params); showFilter=false;">Done
								</b-button>
							</div>
						</b-card>
					</div>
				</div>
			</transition>
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
				<template slot="actions" slot-scope="row">
					<b-button v-if="row.item.bookingStatus!='canceled'"
										size="sm"
										class="btn-status"
										@click.stop="changeBookingStatus('canceled', row.item)">
						Cancel
					</b-button>
					<b-button v-if="row.item.bookingStatus=='pending'"
										size="sm"
										variant="success"
										@click.stop="changeBookingStatus('confirmed', row.item)"
										class="btn-status">
						Confirm
					</b-button>
				</template>
				<template slot="row-details" slot-scope="row">
					<row-details :row="row"
											:disabledDates="disabledDates"
											:days="days"
											:restaurant="$store.state.restaurant">
					</row-details>
				</template>
			</b-table>
		</div>
	</div>
</template>

<script>
	import rowDetails from "@/features/restaurant/bookingDetails.vue";

	export default {
		name: "booking-restaurant",

		components: {
			'row-details': rowDetails 
		},

		props: {
			item: null
		},

		data () {
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
				],
				params: {},
				showFilter: false,
				selectedList: null,

				disabledDates: {},
				days: ['sunday', 'monday', 'tuesday', 'wednesday', 'thursday', 'friday', 'saturday']
			}
		},

		computed: {
			restaurantId() {
				return this.$store.state.restaurant.id;
			}
		},

		watch: {
			restaurantId() {
				this.getBookings(this.params);

				this.updateDisabledDates();

					},

			// When user navigates on sidebar change 'this.selectedList' to update list
			item(newValue) {
				// When user clicks on 'Bookings' open upcoming booking by default
				newValue = (newValue === 'Bookings' ? 'Upcoming bookings' : newValue)
				this.selectedList = newValue;
			},

			selectedList(newValue) {
				this.updateBookingList(newValue);
			}
		},

		mounted() {
			if (!this.item || this.item == 'Bookings')
				this.selectedList = 'Upcoming bookings';
			else
				this.selectedList = this.item;

			this.updateDisabledDates();
		},

		methods: {
			toggleDetails(a) {
				a._showDetails = !a._showDetails;
				
				// Get customer details if not present 
				if (!Object.values(a.customerDetails).length) {
					this.customerDetails({id: a.customer}, a);

					// Set new reactive vue properties
					this.$set(a, 'edit', false);
					this.$set(a, 'buffer', {});
					console.log(a);

					// Create buffer, to list and edit booking details
					a.buffer = {
						bookingFrom: a.bookingFrom,
						noOfPersons: a.noOfPersons,
						tables: a.tables,
						date: a.bookingFrom
					};
				}
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

			getBookings(params) {
				console.log('Getting bookings: ', JSON.stringify(params));
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
					if (response.ok && response.body.bookings) {
						// Add customerDetails key to view details of customer on each booking 
						// Add _showDetails key to toggle details on each booking 
						// Add rowVariant key to change style of each booking depending on booking status
						this.bookings = response.body.bookings.map(x => {
							x.customerDetails = {};
							x._showDetails = false ;
							x._rowVariant = (x.bookingStatus == 'confirmed')
								? 'success'
								: (x.bookingStatus == 'canceled')
									? 'active'
									: 'warning';
							return x;
						});
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
			},
			updateBookingList(item) {
				if (item == 'Upcoming bookings') {
					this.params.before = null;
					this.params.after = (new Date()).getTime();
					this.getBookings(this.params);
				}
				if (item == 'Past bookings') {
					this.params.before = (new Date()).getTime();
					this.params.after = null;
					this.getBookings(this.params);
				}
				if (item == 'All bookings') {
					this.params.before = null;
					this.params.after = null;
					this.getBookings(this.params);
				}
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

			updateDisabledDates() {
				// Disable past dates
				this.disabledDates.to = new Date(new Date().setDate(new Date().getDate()-1));

				// Disable restaurant close days of a week
				let restaurant = this.$store.state.restaurant;
				let days = [];

				this.days.forEach(function(day, index) {
					if (restaurant.businessHours[day].end == 0) {
						days.push(index);
					}
				});
				this.disabledDates.days = days;
				console.log('Date disabled for bookings: ', this.disabledDates);
			},
		}
	}
</script>

<style>
.fa-trash {
	color: #eaa;
}
.btn-status {
font-size: 10px;
padding: 3px;
margin: 1px;
}
.slide-enter-active {
  transition: all .3s cubic-bezier(1.0, 0.5, 0.8, 1.0);
}
.slide-leave-active {
  transition: all .3s cubic-bezier(1.0, 0.5, 0.8, 1.0);
}
.slide-enter, .slide-leave-to {
  transform: translateY(-10px);
  opacity: 0;
}
.flex-container {
	display: flex;
	justify-content: left;
}
.booking-list-restauranteur .form-control[readonly] {
	background-color: white;
}
.booking-list-restauranteur .form-control:disabled {
	background-color: #e9ecef;
}
</style>
