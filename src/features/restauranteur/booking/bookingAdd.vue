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
	</div>
</template>

<script>
	export default {
		props: ['selectedList'],

		data() {
			return {
				error: false,
				msg: '',
			}
		},

		mounted() {
		}
	}
</script>
