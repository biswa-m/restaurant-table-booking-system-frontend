<template>
	<div class="restaurantAdd">
		<div class="container">
			<div class="restaurant-add-form">
				<div class="main-div">
					<div class="panel">
						<h2>Add Restaurant</h2>
						<p>Please enter your restaurant details</p>
					</div>
					<div v-show="error" class="alert alert-warning alert-dismissible" role="alert">
						<strong>{{msg}}</strong>
					</div>
					<form v-on:submit.prevent="addRestaurant">
						<div class="form-group">
							<label for="restaurantName" class="form-label">Name</label>
							<div class="form-group row">
								<input v-model="restaurantName" type="text" class="form-control" id="restaurantName" placeholder="restaurant name" required>
							</div>
						</div>

						<div class="form-group">
							<label for="address" class="col-form-label">Address</label>
							<div class="form-group row">
									<input v-model="add1" type="text" class="form-control" id="addressLine1" placeholder="address line 1" required>
							</div>

							<div class="form-group row">
									<input v-model="add2" type="text" class="form-control" id="addressLine2" placeholder="address line 2">
							</div>

							<div class="form-group row">
									<input v-model="city" type="text" class="form-control" id="city" placeholder="city / town" required>
							</div>

							<div class="form-group row">
									<input v-model="state" type="text" class="form-control" id="city" placeholder="state / province / region" required>
							</div>

							<div class="form-group row">
									<input v-model="pin" type="text" class="form-control" id="pincode" placeholder="pincode" required>
							</div>
						</div>

						<div class="form-group">
							<label for="description" class="form-label">Description</label>
							<div class="form-group row">
								<textarea v-model="desc" type="text" rows="4" class="form-control" id="description" placeholder="description"></textarea>
							</div>
						</div>

						<label for="description" class="form-label">Business Hours</label>
						<div class="form-group" v-for="day in days">
							<div class="row">
								<div class="col-sm-2">
									<label for="description" class="form-label">{{day.value}}</label>
								</div>
								<div class="col-sm-5">
									<div class="timepicker row">
										<vue-timepicker v-model="day.start"></vue-timepicker>
									</div>
									<div class="timepicker row">
										<small>start time</small>
									</div>
								</div>
								<div class="col-sm-5">
									<div class="timepicker row">
										<vue-timepicker v-model="day.end"></vue-timepicker>
									</div>
									<div class="timepicker row">
										<small>end time</small>
									</div>
								</div>
							</div>
						</div>

						<button class="btn btn-lg btn-primary btn-restaurant" type="submit">Submit</button>
					</form>
					<div v-show="error" class="alert alert-warning alert-dismissible" role="alert">
						<strong>{{msg}}</strong>
					</div>
				</div>
			</div>
		</div>
	</div>
</template>

<script>
	import vueTimepicker from 'vue2-timepicker'
	export default {
		name: "loginScreen",

		components: {
			vueTimepicker
		},

		data() {
			var weekdays = ['sunday', 'monday', 'tuesday', 'wednesday', 'thursday', 'friday', 'saturday'];

			var days = {};

			weekdays.forEach(function(day) {
				days[day] = {};
				days[day].value = day;
				days[day].start = {HH: '10', mm: '00'};
				days[day].end = {HH: '19', mm: '00'};
			});

			return {
				error: false,
				msg: '',

				restaurantName: '',
				add1: '',
				add2: '',
				city: '',
				state: '',
				pin: '',
				desc: '',

				days
			}
		},

		methods: {
			addRestaurant() {
				this.error = false;

				var error = false;
				var msg = '';
				var days = this.days;

				var businessHours = {};

				Object.keys(days).forEach(function(day) {
					businessHours[day] = {};
					businessHours[day].start = days[day].start.HH * 100 + days[day].start.mm * 1;
					businessHours[day].end = days[day].end.HH * 100 + days[day].end.mm * 1;

					if (businessHours[day].start > businessHours[day].end) {
						error =true;
						msg = msg ? msg + ", " + day : "Invalid business hours on " + day;
						return;
					}
				});

				this.error = error;
				this.msg = msg;
				if (error) return;

				var address = this.add1 + '\n' +(this.add2 ? (this.add2 + '\n') : '')+ 'city: ' + this.city + ' ' + this.state + '\npincode: ' + this.pin;

				this.$http.post(
					process.env.VUE_APP_API_ROUTE + 'restaurant',
					{
						restaurant: {
							name: this.restaurantName,
							address: address,
							description: this.desc,
							businessHours: businessHours 
						}
					},
					{
						headers: {
							Authorization: 'Bearer ' + JSON.parse(this.$store.state.user).token}
					}
				).then((response) => {
					console.log(response);
					if (response.ok && response.body.restaurant.id) {
						this.$router.push('/restaurant/' + response.body.restaurant.id);
						console.log('Restaurant created');
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
						: "something not right!";
					console.log(JSON.stringify(e));
				});
			},
		}
	};

</script>

<style scoped>
.restaurantAdd {background: #777777;}
.form-heading { color:#fff; font-size:23px;}
.panel {
	text-align: center;
}
.panel h2{ color:#444444; font-size:20px; margin:0 0 8px 0;}
.panel p { color:#777777; font-size:14px; margin-bottom:30px; line-height:24px;}

.main-div {
  background: #ffffff none repeat scroll 0 0;
  border-radius: 2px;
  margin: 10px auto 30px;
  max-width: 600px;
  padding: 50px 70px 70px 71px;
	text-align: left;
}

.login-form .form-group {
  margin-bottom:10px;
  font-size: 10px;
}
.forgot a {
  color: #777777;
  font-size: 14px;
  text-decoration: underline;
}
.restaurant-add-form  .btn.btn-primary {
  background: #f0ad4e none repeat scroll 0 0;
  border-color: #f0ad4e;
  color: #ffffff;
  font-size: 14px;
  height: 50px;
  line-height: 50px;
  padding: 0;
}
.forgot {
  text-align: left; margin-bottom:30px;
}
.botto-text {
  color: #ffffff;
  font-size: 14px;
  margin: auto;
}
.login-form .btn.btn-primary.reset {
  background: #ff9900 none repeat scroll 0 0;
}
.back { text-align: left; margin-top:10px;}
.back a {color: #444444; font-size: 13px;text-decoration: none;}
.btn-restaurant {width:100px}
.timepicker {
	width:100%;
	text-align: center;
	padding: 0px 10px 0px 10px
}
</style>
