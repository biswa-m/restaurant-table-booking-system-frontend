<template>
	<transition name="modal">
		<div class="modal-mask">
			<div class="modal-wrapper">
				<div class="modal-container">
					<button class="modal-close-button"
						@click="$emit('close')">&times
					</button>
					<div class=modal-login>
						<customerLogin @close="$emit('close')">
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

.modal-close-button {
  border-radius: 50px;
	padding: 0px 10px 0px 10px;
	background: #f0ad4e;
	font-size: 25px;
	float: right;
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
