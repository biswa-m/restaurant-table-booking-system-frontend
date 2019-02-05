<template>
	<div class="wrapper">
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
	</div>
</template>

<script>
	export default {
		data() {
			return {
				bookingWindow: "init",
				date: '',
				time: '',
				noOfPersons: '',
				name: '',
				email: '',
				phone: '',
				days: ['sunday', 'monday', 'tuesday', 'wednesday', 'thursday', 'friday', 'saturday']
			}
		},

		props: ['restaurant'],

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
					console.log('Initiating booking');
					return this.bookTable();
				} else {
					return this.bookingWindow = "customerDetails"
				}
			},

			processCustomerDetails() {
				console.log('Processing customer details');
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
		font-size: 17px;
		height: 50px;
		width: 200px;
		line-height: 50px;
		padding: 0;
	}
	.horizontal-label {
		padding: 13px 10% 0 5%;
		margin-top: 9px;
		text-align: right;
}

</style>
