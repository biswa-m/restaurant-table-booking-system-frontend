<template>
	<div v-show="authenticated=='restaurant'"class="container" style="background:#fff">
		<div class="row list-table">
			<div v-show="error" class="alert alert-warning alert-dismissible mx-auto" role="alert">
				<strong>{{msg}}</strong>
			</div>
			<b-table responsive striped hover stacked="sm" :items="bookings" :fields="bookingFields" @row-clicked="toggleDetails">

				<template slot="bookingFrom" slot-scope="row">
					{{convertFormat(row.value)}}
				</template>

				<template slot="tables" slot-scope="row">
					{{row.value[0].tableIdentifier}}
				</template>

				<template slot="actions" slot-scope="row">
				</template>

				<template slot="row-details" slot-scope="row">
					<b-card>
						<b-form @submit.prevent="updateTable(row.item, row.toggleDetails)" @reset="row.toggleDetails">
						</b-form>
					</b-card>
				</template>

			</b-table>
		</div>
	</div>
</template>

<script>

	export default {
		name: "tables",

		components: {
		},

		data () {
			return {
				restaurantId: this.$route.params.id,
				error: false,
				msg: '',
				authenticated: this.$store.state.authenticated,
				bookings: [],
				bookingFields: [
					{key: 'bookingFrom', label: 'Date'},
					{key: 'tables', label: 'Table'},
					{key: 'noOfPersons', label: 'Persons'},
					{key: 'bookingStatus', label: 'Status'},
					{key: 'actions', label: ''}
				]
			}
		},

		mounted() {
			console.log('Getting bookings');
			this.$http.get(
				process.env.VUE_APP_API_ROUTE + 'restaurant/bookings/' + this.restaurantId,
				{
					headers: {
						Authorization: 'Bearer ' + JSON.parse(this.$store.state.user).token
					}
				}
			).then((response) => {
				console.log(response);
				if (response.ok && response.body.bookings) {
					// Add _showDetails key to toggle details on table
					this.bookings = response.body.bookings.map(x => {x._showDetails=false ; return x});
					console.log('Bookings: ', (this.bookings));
				} else {
					this.error = true;
					this.msg = (response.body.errors && response.body.errors.message)
						? response.body.errors.message
						: "Could not get the bookings";
				}
			}).catch((e) => {
				this.error = true;
				this.msg = (e.body && e.body.errors && e.body.errors.message)
					? e.body.errors.message
					: "Could not get the bookings";
				console.log(JSON.stringify(e));
			});
		},

		methods: {
			toggleDetails(a) {
				a._showDetails = !a._showDetails;
			},

			convertFormat(date) {
				return ((new Date(date)).toLocaleString());
			}
		}
	}
</script>

<style>
.list-table {
	margin-top: 20px;
}
.fa-trash {
	color: #eaa;
}
.btn-status {
font-size: 10px;
padding: 3px;
margin: 1px;
}
</style>
