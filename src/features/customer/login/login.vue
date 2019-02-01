<template>
	<div class="login-container">

		<div v-show="!signup" class="login">
			<div class="panel">
				<h2><b>Login</b></h2>
				<p>Please enter your email and password</p>
			</div>
			<div v-show="error" class="alert alert-warning alert-dismissible" role="alert">
				<strong>Warning! </strong>{{msg}}
			</div>
			<form v-on:submit.prevent="login">
				<div class="form-group">
					<input v-model="email" type="email" class="form-control" placeholder="Email Address" required>
				</div>
				<div class="form-group">
					<input v-model="password" type="password" class="form-control" placeholder="Password" required>
				</div>
				<div class="forgot">
					<a href="#">Forgot password?</a>
				</div>
				<button class="btn btn-lg btn-primary btn-block login-button" data-loading-text="Signing in..." type="submit">Login</button>
			</form>
			<hr>
			<p class="signup">Don't have an account?</p>
			<button @click="signup=true" class="btn btn-md btn-primary btn-block signup-button" data-loading-text="Loading..">Sign Up</button>
		</div>

		<div v-show="signup" class="signup">
			<div class="panel">
				<h2><b>Create an account</b></h2>
			</div>
			<div v-show="error" class="alert alert-warning alert-dismissible" role="alert">
				<strong>Warning! </strong>{{msg}}
			</div>
			<form v-on:submit.prevent="signup1">
				<div class="form-group">
					<input v-model="name" type="text" class="form-control" placeholder="Name" required>
				</div>
				<div class="form-group">
					<input v-model="phone" type="number" class="form-control" placeholder="Phone No. (10 digit)" required>
				</div>
				<div class="form-group">
					<input v-model="email" type="email" class="form-control" placeholder="Email Address" required>
				</div>
				<div class="form-group">
					<input v-model="password" type="password" class="form-control" placeholder="Password" required>
				</div>
				<button class="btn btn-lg btn-primary btn-block login-button" data-loading-text="Creating Account.." type="submit">Sign Up</button>
			</form>
			<hr>
			<p class="signup">Already have an account?</p>
			<button @click="signup=false" class="btn btn-md btn-primary btn-block signup-button" data-loading-text="Loading..">Login</button>
		</div>

	</div>
</template>

<script>
export default {
	  name: "customerLogin",

		data() {
			return {
				name: '',
				phone: '',
				email: '',
				password: '',
				error: false,
				msg: '',
				signup: false
			}
		},
		methods: {
			login() {
				this.error=false;
				this.$http.post(
					process.env.VUE_APP_API_ROUTE + 'user/login',
					{
						user: {
							email: this.email,
							password: this.password
						}
					}
				).then((response) => {
					if (response.ok && response.data) {
						this.$store.commit('customerLogin', response.data);
						console.log('Login successful');
						this.$emit('close');
					}
				}).catch((e) => {
					this.error = true;
					this.msg = (e.body && e.body.errors && e.body.errors)
						? e.body.errors
						: "Unable to login";
					console.log(e);
				});
			},
			
			signup1() {
				this.error=false;

				this.$http.post(
					process.env.VUE_APP_API_ROUTE + 'user',
					{
						user: {
							name: this.name,
							phone: this.phone,
							email: this.email,
							password: this.password
						}
					}
				).then((response) => {
					if (response.ok && response.data) {
						this.$store.commit('customerLogin', response.data);
						console.log('Account created and Logged in');
						this.$emit('close');
					}
				}).catch((e) => {
					this.error = true;
					this.msg = (e.body && e.body.errors && e.body.errors && e.body.errors.message)
						? e.body.errors.message
						: "Unable to signup. Please try again";
					console.log(e);
				});

			}
		}
};
</script>

<style scoped>
.form-heading { color:#fff; font-size:23px;}
.form-control {
  background: #f7ebd7 none repeat scroll 0 0;
  border: 1px solid #d4d4d4;
  border-radius: 4px;
  font-size: 14px;
  height: 50px;
  line-height: 50px;
}
.panel h2{ color:#444444; font-size:18px; margin:0 0 8px 0;}
.panel p { color:#777777; font-size:14px; margin-bottom:30px; line-height:24px;}
.form-group {
  margin-bottom:10px;
}
.forgot a {
  color: #777777;
  font-size: 14px;
  text-decoration: underline;
}
.login-button {
  background: #f0ad4e none repeat scroll 0 0;
  border-color: #f0ad4e;
  color: #ffffff;
  font-size: 14px;
  width: 100%;
  height: 50px;
  line-height: 50px;
  padding: 0;
}
.signup-button {
  background: #f3c27e none repeat scroll 0 0;
  border-color: #f3c27e;
}
.forgot {
  text-align: left; margin-bottom:30px;
}
.botto-text {
  color: #ffffff;
  font-size: 14px;
  margin: auto;
}
.signup {
	font-size: 14px;
	color: #555;
	margin-bottom: 4px;
}
</style>
