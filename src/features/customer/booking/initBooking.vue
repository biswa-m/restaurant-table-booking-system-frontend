<template>
	<div class="wrapper">
		<div v-show="error" class="alert alert-warning alert-dismissible" role="alert">
			<strong>Warning! </strong>{{msg}}
		</div>
		<div class="availability"
			v-show="bookingWindow=='init' || (bookingWindow=='customerDetails' && $store.state.authenticated=='customer')">
			<h4>Make a reservation</h4>
			<hr>
			<b-form class="form"  v-on:submit.prevent="checkUser">
				<b-row>
					<b-col md="4">
						<span class="label">Date</span>
						<datepicker
							v-model="date"
							input-class="form-control input"
							calendar-class="calendar1"
							:disabledDates="disabledDates"
							placeholder="Select Date"
						>
						</datepicker>
					</b-col>
					<b-col md="4">
						<span class="label">Time</span><br/>
						<div class="dropdown">
							<button class="form-control input" type="button" id="dropdownMenuButton" data-toggle="dropdown" aria-haspopup="true" aria-expanded="false">
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
					<b-col md="4">
						<span class="label">No of persons</span>
						<b-form-input class="input" type="number" min=1 v-model="noOfPersons" placeholder="Enter no. of persons" required/>
					</b-col>
				</b-row>
				<div class="booking-details">
					<b-row>
						<p v-show="!this.date || (this.time != 0 && !this.time) || !this.noOfPersons"
							class="form-instruction mx-auto">
							Please enter your date, time and party size
						</p>
				</b-row>
				</div>
				<b-row>
					<button class="btn btn-lg btn-primary submit-button mx-auto"
						:disabled="!date || (time != 0 && !time) || !noOfPersons || noOfPersons==0"
						data-loading-text="Finding table..."
						type="submit">
						<b>Book Table</b>
					</button>
				</b-row>
			</b-form>
		</div>
		<div v-if="bookingWindow=='customerDetails' && $store.state.authenticated!='customer'" class="customer-details">
			<hr>
			<h4>Please provide your details</h4>
			<b-form class="form" v-on:submit.prevent="processCustomerDetails">
				<b-row>
					<b-col sm="3">
						<div class="horizontal-label">Name</div>
					</b-col>
					<b-col sm="9">
						<b-form-input class="input" type="text" v-model="name" placeholder="Name" required/>
					</b-col>
				</b-row>
				<b-row>
					<b-col sm="3">
						<div class="horizontal-label">Email</div>
					</b-col>
					<b-col sm="9">
						<b-form-input class="input" type="email" v-model="email" placeholder="Email" required/>
					</b-col>
				</b-row>
				<b-row>
					<b-col sm="3">
						<div class="horizontal-label">Phone No.</div>
					</b-col>
					<b-col sm="9">
						<b-form-input class="input" type="number" v-model="phone" placeholder="Phone" required/>
					</b-col>
				</b-row>
				<b-row>
					<button class="btn btn-lg btn-primary submit-button mx-auto"
						data-loading-text="Finding table..."
						type="submit">
						<b>Book Table</b>
					</button>
				</b-row>
			</b-form>
		</div>
		<div v-if="(bookingWindow=='login' || bookingWindow=='confirmation') && $store.state.authenticated!='customer'" class="customer-details">
			<hr>
			<div class="login mx-auto">
				<login @close="bookingWindow='confirmation'">
					<template slot="loginMsg">			
						<small>Email or phone number already exist</small><br/>
						Please login to continue
					</template>
				</login>
			</div>
		</div>
		<div v-if="(bookingWindow=='confirmation'	&& $store.state.authenticated=='customer')"	class="customer-details">
			<h4>Please confirm your booking details</h4>
			<hr>
			<b-form class="form"  v-on:submit.prevent="bookTable">
				<b-row class="my-3">
					<b-col sm="4" class="text-sm-right">
						<span class="">Date:</span>
					</b-col>
					<b-col sm="8">
						<div class="">
							<datepicker
								v-model="date"
								input-class="no-style"
								calendar-class="calendar1"
								:disabledDates="disabledDates"
								placeholder="Select Date"
								disabled
							>
							</datepicker>
						</div>
					</b-col>
				</b-row>
				<b-row class="my-3">
					<b-col sm="4" class="text-sm-right">
						<span class="">Time:</span>
					</b-col>
					<b-col sm="8">
						<div class="">
							{{formatTime(time)}}
						</div>
					</b-col>
				</b-row>
				<b-row class="my-3">
					<b-col sm="4" class="text-sm-right">
						<span class="">No of persons:</span>
					</b-col>
					<b-col sm="8">
						<div class="">
							{{noOfPersons}}
						</div>
					</b-col>
				</b-row>
				<b-row class="my-3">
					<b-col sm="4" class="text-sm-right">
						<span class="">Restaurant Name:</span>
					</b-col>
					<b-col sm="8">
						<div class="">
							{{restaurant.name}}
						</div>
					</b-col>
				</b-row>
				<b-row class="my-3">
					<b-col sm="4" class="text-sm-right">
						<span class="">Restaurant Address:</span>
					</b-col>
					<b-col sm="8">
						<div class="">
							<span v-html="multiline(restaurant.address)"></span>
						</div>
					</b-col>
				</b-row>
				<b-row>
					<div class="mx-auto">
						<button class="btn btn-lg btn-outline-secondary edit-btn"
							@click.prevent="bookingWindow='init'; error=false"
							v-if="bookingWindow=='confirmation'">
							<b>Edit</b>
						</button>
						<button class="btn btn-lg btn-primary submit-button"
							data-loading-text="Finding table..."
							type="submit"
							v-if="bookingWindow=='confirmation'">
							<b>Confirm</b>
						</button>
					</div>
				</b-row>
			</b-form>
		</div>
		<div v-if="bookingWindow=='booked'" class="successful">
			<h4>We have recieved your request</h4>
			<p>You will get the confirmation shortly</p>
			<div class = mt-5>
				<button class="btn btn-lg btn-outline-success"
					@click.prevent="resetBookingWindow"
					v-if="bookingWindow=='booked'">
					<b>Book More</b>
				</button>
			</div>
		</div>
	</div>
</template>

<script>
	import login from "@/features/customer/login/login.vue";
	import generateTimeSlots from "@/helpers/generateTimeSlots.js";
	import formatTime from "@/helpers/formatTime.js";
	import datepicker from "vuejs-datepicker";

	export default {
		data() {
			return {
				bookingWindow: 'init',

				date: '',
				time: '',
				noOfPersons: '',
				name: '',
				email: '',
				phone: '',

				days: ['sunday', 'monday', 'tuesday', 'wednesday', 'thursday', 'friday', 'saturday'],
				timeSlots: [],
				timeInterval: 30,

				disabledDates: {},

				error: false,
				msg: ""
			}
		},

		props: ['restaurant'],

		components: {login, datepicker},

		beforeMount() {
			// Set datepicker
			let restaurant = this.restaurant;
			let days = [];
			this.disabledDates.to = new Date(new Date().setDate(new Date().getDate()-1));

			this.days.forEach(function(day, index) {
				if (restaurant.businessHours[day].end == 0) {
					days.push(index);
				}
			})
			this.disabledDates.days = days;
		},

		watch: {
			date: function(date) {
				// Reset selected time
				this.time = null;

				if (!date) return;

				// Set time slots
				let businessHours = this.restaurant.businessHours[this.days[date.getDay()]];
				this.timeSlots = generateTimeSlots(businessHours.start, businessHours.end, this.timeInterval, date);
			}
		},

		methods: {
			formatTime: formatTime,

			checkUser() {
				if (this.$store.state.authenticated === "customer"
					&& JSON.parse(this.$store.state.user)
					&& JSON.parse(this.$store.state.user).token) {
					this.bookingWindow = 'confirmation';
				} else {
					return this.bookingWindow = "customerDetails";
				}
			},

			processCustomerDetails() {
				console.log('Processing customer details');
				this.error = false;
				
				// Signup user
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
						this.$store.commit('customerLogin', response.data);
						console.log('Account created and Logged in');
						this.bookingWindow = 'confirmation';
					}
				}).catch((e) => {
					console.log(e);

					if (e.status == 401){
						this.bookingWindow = 'login';
						return console.log('Login to continue');
					}

					this.error = true;
					this.msg = (e.body && e.body.errors && e.body.errors && e.body.errors.message)
						? e.body.errors.message
						: "Unable to signup. Please try again";
				});

			},

			bookTable() {
				console.log('Processing booking request');

				let date = this.date.setHours(parseInt(this.time/100), this.time%100 , 0, 0);
				console.log(date);

				this.$http.post(
					process.env.VUE_APP_API_ROUTE + 'booking',
					{
						booking: {
							restaurant: this.restaurant.id,
							noOfPersons: this.noOfPersons,
							bookingFrom: date
						}
					},
					{
						headers: {
							Authorization: 'Bearer ' + JSON.parse(this.$store.state.user).token}
					}
				).then((response) => {
					console.log(response);
					if (response.ok && response.body.booking) {
						console.log('booked');
						this.bookingWindow = 'booked';
					} else {
						this.error = true;
						this.msg = (response.body.errors && response.body.errors.message)
							? response.body.errors.message
							: "something not right!";
					}
				}).catch((e) => {
					this.error = true;
					this.msg = (e.body && e.body.errors && e.body.errors.message)
						? e.body.errors.message
						: "Booking Failed";
					console.log(JSON.stringify(e));
				});
			},

			resetBookingWindow() {
				this.bookingWindow = 'init';
				this.date = '';
				this.time = '';
				this.noOfPersons = '';
			},

			multiline(value) {
				return JSON.parse(JSON.stringify(value).replace(/\\n/gi, "<br/>"));
			}
		}
	}
</script>

<style scope>
	.input {
		margin: 10px 0 10px 0; 
		height: 50px;
		background: #f7ebd7 !important;
		text-align: left;
		border: 1px solid #3333;
	}
	.booking-details {
		height: 150px;
	}
	.form-instruction {
		text-align: center;
		padding: 10px 10% 10px 10%;
	}
	.form {
		text-align: left;
	}
	.label {
		padding-left: 10px;
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
	.edit-btn {
		width: 100px;
		font-size: 17px;
	}
	.horizontal-label {
		padding: 13px 10% 0 5%;
		margin-top: 9px;
		text-align: right;
	}
	.login {
		max-width: 500px;
	}
	.restaurant-row {
		padding: 15px 0 15px 0;
	}
	.successful {
		padding: 10px;
		background: #efc;
		border-style: solid;
		border-width: 2px;
		border-radius: 10px;
		border-color: green;
	}
	.calendar1 {
		max-width: 100%;
		min-width: 200px;
	}
	.placeholder {
		color: #444a;
	}
	.dropdown-menu {
		height: auto;
		max-height: 230px;
		overflow-x: hidden;
	}
	.no-style {
		background: 0;
		border-style: none;
	}
</style>
