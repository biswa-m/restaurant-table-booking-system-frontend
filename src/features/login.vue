<template>
	<transition name="modal">
		<div class="modal-mask">
			<div class="modal-wrapper">
				<div class="modal-container">
					<button class="modal-default-button"
						@click="$emit('close')">&times
					</button>
					<div class=modal-login>
						<slot name="body">
							<div class="panel">
								<h2><b>Login</b></h2>
								<p>Please enter your email and password</p>
							</div>
							<div v-show="error" class="alert alert-warning alert-dismissible" role="alert">
								<strong>Warning! </strong>{{msg}}
							</div>
							<form v-on:submit.prevent="login" id="Login">
								<div class="form-group">
									<input v-model="email" type="email" class="form-control" id="inputEmail" placeholder="Email Address" required>
								</div>
								<div class="form-group">
									<input v-model="password" type="password" class="form-control" id="inputPassword" placeholder="Password" required>
								</div>
								<div class="forgot">
									<a href="#">Forgot password?</a>
								</div>
								<button class="btn btn-lg btn-primary btn-block login-button" data-loading-text="Signing in..." type="submit">Login</button>
							</form>
							<hr>
							<p class="signup">Don't have an account?</p>
							<button class="btn btn-md btn-primary btn-block signup-button" data-loading-text="Loading..">Sign Up</button>
						</slot>
					</div>
				</div>
			</div>
		</div>
	</transition>
</template>

<script>
export default {
	  name: "loginScreen",

		data() {
			return {
				email: '',
				password: '',
				error: false,
				msg: ''
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
					if (response.ok) {
						this.$emit('close');
						this.$store.commit('customerLogin', response.data);
						console.log('Login successful');
					}
				}).catch((e) => {
					this.error = true;
					this.msg = (e.body && e.body.errors && e.body.errors)
						? e.body.errors
						: "Unable to login";
					console.log(e);
				});
			}
		}
};
</script>

<style scoped>
.modal-mask {
  position: fixed;
  z-index: 9998;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background-color: rgba(0, 0, 0, .5);
  display: table;
  transition: opacity .3s ease;
}

.modal-wrapper {
  display: table-cell;
  vertical-align: middle;
}

.modal-container {
  max-width: 400px;
	background: #fff;
  margin: 0px auto;
  border-radius: 10px;
  box-shadow: 0px 8px 8px rgba(0, 0, 0, .33);
  transition: all .3s ease;
  font-family: Helvetica, Arial, sans-serif;
}

.modal-login {
	padding: 10% 10% 10% 10%;
}

.title {
	font-size: 30px;
}

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
.modal-default-button {
  border-radius: 50px;
	padding: 0px 10px 0px 10px;
	background: #f0ad4e;
	font-size: 25px;
	float: right;
}
.signup {
	font-size: 14px;
	color: #555;
	margin-bottom: 4px;
}
/*
 * The following styles are auto-applied to elements with
 * transition="modal" when their visibility is toggled
 * by Vue.js.
 */

.modal-enter {
  opacity: 0;
}

.modal-leave-active {
  opacity: 0;
}

.modal-enter .modal-container,
.modal-leave-active .modal-container {
  -webkit-transform: scale(1.1);
  transform: scale(1.1);
}

</style>
