<template>
	<transition name="modal">
		<div class="modal-mask">
			<div class="modal-wrapper">
				<div class="modal-container">
					<div class=modal-login>
						<customerLogin @close="redirect">
						</customerLogin>
					</div>
				</div>
			</div>
		</div>
	</transition>
</template>

<script>
	import customerLogin from "./login.vue"

	export default {
	  name: "loginScreen",

		components: {
			customerLogin,
		},

		methods: {
			redirect() {
				console.log('redirecting to home');
				this.$router.push('/');
			}
		}
};
</script>

<style scoped>
.modal-mask {
  width: 100%;
  height: 100vh;
  background-color: rgba(0, 0, 0, .5);
  display: table;
}

.modal-wrapper {
	margin-top: 20px
}
.modal-container {
  max-width: 400px;
	background: #fff;
  margin: 0px auto;
  border-radius: 10px;
  box-shadow: 0px 8px 8px rgba(0, 0, 0, .33);
  font-family: Helvetica, Arial, sans-serif;
}

.modal-login {
	padding: 10% 10% 10% 10%;
}
</style>
