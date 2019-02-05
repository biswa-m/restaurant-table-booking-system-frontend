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
						<b-form-input class="input" type="date" :state="validateDate(date)" v-model="date" placeholder="Date" required/>
					</b-col>
					<b-col md="4">
						<span class="label">Time</span>
						<b-form-input class="input" type="time" :state="validateTime(time, date)" v-model="time" required/>
					</b-col>
					<b-col md="4">
						<span class="label">No of persons</span>
						<b-form-input class="input" type="number" v-model="noOfPersons" placeholder="People" required/>
					</b-col>
				</b-row>
				<div class="booking-details">
					<b-row>
						<p v-show="!this.date || !this.time || !this.noOfPersons"
							class="form-instruction mx-auto">
							Please enter your date, time and party size
						</p>
				</b-row>
				</div>
				<b-row>
					<button class="btn btn-lg btn-primary submit-button mx-auto"
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
		<div v-if="(bookingWindow=='confirmation'
			&& $store.state.authenticated=='customer')
			|| bookingWindow=='booked'" class="customer-details">
			<h4 v-show="bookingWindow=='confirmation'">Please confirm your booking details</h4>
			<div v-show="bookingWindow=='booked'" class="successful">
				<h4>We have recieved your request</h4>
				<p>You will get the confirmation shortly</p>
			</div>
			<hr>
			<b-form class="form"  v-on:submit.prevent="bookTable">
				<b-row>
					<b-col md="4">
						<span class="label">Date</span>
						<b-form-input class="input" type="date" :state="validateDate(date)" v-model="date" placeholder="Date" required readonly/>
					</b-col>
					<b-col md="4">
						<span class="label">Time</span>
						<b-form-input class="input" type="time" :state="validateTime(time, date)" v-model="time" required readonly/>
					</b-col>
					<b-col md="4">
						<span class="label">No of persons</span>
						<b-form-input class="input" type="number" v-model="noOfPersons" placeholder="People" required readonly/>
					</b-col>
				</b-row>
				<b-row class="restaurant-row">
					<b-col sm="4">
						<span class="textarea">Restaurant Name:</span>
					</b-col>
					<b-col sm="8">
						<div class="textarea">
							{{restaurant.name}}
						</div>
					</b-col>
				</b-row>
				<b-row class="restaurant-row">
					<b-col sm="4">
						<span class="textarea">Restaurant Address:</span>
					</b-col>
					<b-col sm="8">
						<div class="textarea address">
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
						<button class="btn btn-lg btn-outline-primary"
							@click.prevent="resetBookingWindow"
							v-if="bookingWindow=='booked'">
							<b>Book More</b>
						</button>
					</div>
				</b-row>
			</b-form>

		</div>
	</div>
</template>

<script>
	import login from "@/features/customer/login/login.vue";
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

				error: false,
				msg: ""
			}
		},

		props: ['restaurant'],

		components: {
			login: login
		},

		methods: {
			validateDate(value) {
				if (!value) return undefined;
				if ((new Date(value)).getTime() >= (new Date().setHours(0,0,0,0))) return undefined;
				else return false;
			},
			validateTime(time, date) {
				if (!time || !date) return undefined;

				date = new Date(date + ' ' + time);

				// If time is less than current time
				if (date.getTime() <= Date.now()) return false;

				// Check business hours
				let businessHours = this.restaurant.businessHours[this.days[date.getDay()]];
				time = parseInt(time[0]+time[1]) * 100 + parseInt(time[3]+time[4]);

				if (time >= businessHours.start && time <= businessHours.end)
					return undefined;
				else
					return false;
			},

			checkUser() {
				if (this.$store.state.authenticated === "customer"
					&& JSON.parse(this.$store.state.user)
					&& JSON.parse(this.$store.state.user).token) {
					this.bookingWindow = 'confirmation';
				} else {
					return this.bookingWindow = "customerDetails"
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

				let date = (new Date(this.date + ' ' + this.time)).getTime();

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

<style>
	.input {
		margin: 10px 0 10px 0; 
		height: 50px;
		background: #f7ebd7;
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
		text-align: right;
	}
	.textarea {
		text-align: left;
	}
	.address {
		margin-bottom: 50px;
	}
	.successful {
		padding: 10px;
		background: #efc;
		border-style: solid;
		border-width: 2px;
		border-radius: 10px;
		border-color: green;
	}
</style>
