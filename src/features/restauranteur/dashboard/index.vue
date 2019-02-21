<template>
	<div class="container">
		<div class="restaurant">
			<div class="row">
				<div class="col-md-6 restaurant-photo-wrapper">
					<img class="restaurant-photo mx-auto"src="@/assets/image/restaurant1.jpeg">
				</div>
				<div class="restaurant-details col-md-6">
						<h4 class="title">{{$store.state.restaurant.name}}</h4>
						<p class="description" v-html="$store.state.restaurant.description"></p>
						<p class="address" v-html="$store.state.restaurant.address"></p>
				</div>
			</div>
		</div>
		<div class="statics">
			<dashboardStatics :key="$store.state.restaurant.id"/>
		</div>
	</div>
</template>

<script>
	import dashboardStatics from "@/features/restauranteur/dashboard/statistic.vue"
	export default {
		components: {
			dashboardStatics
		}
	}
</script>

<style scoped>
.restaurant {
	margin: 15px;
	padding: 20px;
	border-style: solid;
	border-color: #bbb;
	border-radius: 18px;
	border-width: 3px;
	background: #fff;
}
.restaurant .border {
	border: 4px !important;
}
.restaurant-photo-wrapper {
	max-height: 250px;
}
.restaurant-photo {
	max-height: 100%;
	max-widht: 100%;
}
.restaurant-details {
	text-align: left;
	padding: 15px;
}
.restaurant-details p {
	font-size: 14px;
}
</style>
