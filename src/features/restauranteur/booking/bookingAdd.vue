<template>
	<div class="mt-3">
		<h3 class="text-left">
			<small>Create new booking to </small>
			<b>{{$store.state.restaurant.name}}</b>
		</h3>
		<div v-show="error" class="alert alert-warning alert-dismissible mx-auto" role="alert">
			<strong>{{msg}}</strong>
		</div>
		<hr>
		<div class="availability mt-5" v-if="bookingWindow=='init'">
			<b-form class="form"  v-on:submit.prevent="addBooking">
				<div v-if="!newCustomer">
					<b-row>
						<b-col md="6">
							<span class="label">Customer phone number</span>
							<b-form-input class="input" type="number" v-model="phone" placeholder="Customer phone number" required/>
						</b-col>
						<b-col md="6">
							<span class="label">No of persons</span>
							<b-form-input class="input" type="number" min=1 v-model="noOfPersons" placeholder="Enter no. of persons" required/>
						</b-col>
					</b-row>
					<b-row>
						<b-col md="6">
							<span class="label">Date</span>
							<datepicker
								v-if="disabledDates"
								v-model="date"
								input-class="form-control input"
								calendar-class="calendar1"
								:disabledDates="disabledDates"
								placeholder="Select date"
							>
							</datepicker>
						</b-col>
						<b-col md="6">
							<span class="label">Time</span><br/>
							<div class="dropdown">
								<button class="form-control input"
												type="button"
												id="dropdownMenuButton"
												data-toggle="dropdown"
												aria-haspopup="true"
												aria-expanded="false">
									{{formatTime(time)}}
									<span v-if="time!=0 && !time" class="placeholder">Select time</span>
								</button>
								<div class="dropdown-menu" aria-labelledby="dropdownMenuButton">
									<div v-if="!date" class="text-warning text-center">Select date first</div>
									<div v-for="slot in timeSlots">
										<a @click="time=slot" class="dropdown-item">{{formatTime(slot)}}</a>
									</div>
								</div>
							</div>
						</b-col>
					</b-row>
				</div>
				<b-row v-if="newCustomer">
					<b-col md="12">
						<h6 class="mb-3 text-center"><small>New customer!</small><br/>
							<u>Please provide customer details</u>
						</h6>
					</b-col>
					<b-col md="6">
						<span class="label">Name</span>
						<b-form-input class="input" type="text" v-model="name" placeholder="Customer name" required/>
					</b-col>
					<b-col md="6">
						<span class="label">email</span>
						<b-form-input class="input" type="email" v-model="email" placeholder="Customer email" required/>
					</b-col>
				</b-row>

				<b-row>
					<div class="mx-auto">
						<a class="btn btn-md btn-link mt-5 mx-1" @click="resetData">
							Reset
						</a>
						<button class="btn btn-lg btn-primary submit-button mt-5"
							:disabled="!date || (time != 0 && !time) || !noOfPersons || !phone"
							type="submit">
							<b>Add Booking</b>
						</button>
					</div>
				</b-row>
			</b-form>
		</div>
		<div class="availability mt-5" v-if="bookingWindow=='details'">
			<div class="alert alert-success">
				New Booking Added
			</div>
			<row-details :row="row"
									:disabledDates="disabledDates"
									:days="days"
									:restaurant="$store.state.restaurant"
									@ok="resetData">
			</row-details>
		</div>
	</div>
</template>

<script>
	import formatTime from "@/helpers/formatTime.js";
	import generateTimeSlots from "@/helpers/generateTimeSlots.js";
	import rowDetails from "@/features/restauranteur/booking/bookingDetails.vue";
	import datepicker from "vuejs-datepicker";

	export default {
		props: ['selectedList', 'disabledDates'],

		data() {
			return {
				error: false,
				msg: '',

				bookingWindow: 'init',
				newCustomer: false,

				date: null,
				time: null,
				noOfPersons: null, 
				name: null,
				email: null,
				phone: null,

				days: ['sunday', 'monday', 'tuesday', 'wednesday', 'thursday', 'friday', 'saturday'],
				timeSlots: [],
				timeInterval: 30,

				booking: {},
				row: {item: {}}
			}
		},

		components: {
			datepicker,
			'row-details': rowDetails,
		},

		watch: {
			date: function(date) {
				// Reset selected time
				this.time = null;

				if (!date) return;

				// Set time slots
				let businessHours = this.$store.state.restaurant.businessHours[this.days[date.getDay()]];
				this.timeSlots = generateTimeSlots(businessHours.start, businessHours.end, this.timeInterval, date);
			}
		},

		mounted() {
		},

		methods: {
			formatTime: formatTime,

			initRow(booking, customer) {
				this.row.item = booking;

				// Set new reactive property to vue
				this.$set(this.row.item, 'edit', false);
				this.$set(this.row.item, 'buffer', {});

				this.row.item.buffer = {
					bookingFrom: booking.bookingFrom,
					noOfPersons: booking.noOfPersons,
					tables: booking.tables,
					date: booking.bookingFrom,
				};

				this.row.item.customerDetails = customer;

				// Function to reset add booking window
				this.row.toggleDetails = function(data) {return};
			},

			resetData() {
				// Reset component data
				this.newCustomer = false,

				this.date = null,
				this.time = null,
				this.noOfPersons = null, 
				this.name = null,
				this.email = null,
				this.phone = null,

				this.booking = {},
				this.row = {item: {}}

				this.bookingWindow = 'init';
			},

			addBooking() {
				this.error = false;

				console.log(this.newCustomer);
				if (this.newCustomer) {
					this.createUser();
				} else {
					console.log('Sending booking request..');

					let date = this.date.setHours(parseInt(this.time/100), this.time%100 , 0, 0);

					// Send booking request
					this.$http.post(
						process.env.VUE_APP_API_ROUTE + 'restaurant/booking/' + this.$store.state.restaurant.id, 
						{
							"user": {
								"phone": this.phone
							},
							"booking": {
								"noOfPersons": this.noOfPersons, 
								"bookingFrom": date
							}
						},
						{
							headers: {
								Authorization: 'Bearer ' + JSON.parse(this.$store.state.user).token
							}
						}
					).then((response) => {
						console.log('booking response: ', response);

						if (response.ok && response.body.booking) {

							this.booking = response.body.booking;

							// Get customer details
							this.$http.get(
								process.env.VUE_APP_API_ROUTE + 'restaurant/' + this.$store.state.restaurant.id + '/customer',
								{
									params: {'id': response.body.booking.customer},
									headers: {
										Authorization: 'Bearer ' + JSON.parse(this.$store.state.user).token
									}
								}
							).then((response) => {
								console.log('customer details: ', response);
								if (response.ok && response.body.customer) {

									// Set new reactive vue properties
									console.log('After setting reactivity, row.item= ', this.row.item);

									// Prepare object to pass to booking-details component
									this.initRow(this.booking, response.body.customer);
									console.log('Row initialzed.', this.row);

									// Show booking Details
									this.bookingWindow = 'details';
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
						}
					}).catch((e) => {
						if (e.status == 406) {
							console.log('New User');
							this.newCustomer = true;
						} else {
							this.error = true;
							this.msg = (e.body && e.body.errors && e.boderrors.message)
								? e.body.errors.message
								: "Could not get the customer Details";
						}
						console.log(JSON.stringify(e));
						console.log(JSON.stringify(e.status));
					});
				}
			},

			createUser() {
				this.$http.post(
					process.env.VUE_APP_API_ROUTE + 'user',
					{
						user: {
							name: this.name,
							phone: this.phone,
							email: this.email,
						}
					}
				).then((response) => {
					if (response.ok && response.data) {
						this.newCustomer = false;
						this.addBooking();
					}
				}).catch((e) => {
					this.error = true;
					this.msg = (e.body && e.body.errors && e.body.errors && e.body.errors.message)
						? e.body.errors.message
						: "Unable to create user";
					console.log(e);
				});
			}
		}
	}
</script>

<style>
	.input {
		margin: 10px 0 10px 0; 
		height: 50px;
		background: #f7ebd7 !important;
		text-align: left;
		border: 1px solid #3333;
	}
	.label {
		padding-left: 10px;
	}
	.form {
		text-align: left;
	}
	.calendar1 {
		max-width: 100%;
		min-width: 200px;
	}
	.dropdown-menu {
		height: auto;
		max-height: 230px;
		overflow-x: hidden;
	}
	.horizontal-label {
		padding: 13px 10% 0 5%;
		margin-top: 9px;
		text-align: right;
	}
	.submit-button {
		background: #f0ad4e;
		border-color: #f0ad4e;
		color: #ffffff;
		margin: 10px;
		width: 200px;
	}
	.submit-button:disabled {
		background: #dbb77a
	}
</style>
