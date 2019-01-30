<template>
	<div v-show="authenticated=='restaurant'"class="container" style="background:#fff">
		<div class=row>
			<add-tables v-on:addtables="getTables"></add-tables>
		</div>
		<div class="row list-table">
			<div v-show="error" class="alert alert-warning alert-dismissible mx-auto" role="alert">
				<strong>{{msg}}</strong>
			</div>
			<b-table striped hover :items="tables" :fields="tableFields"></b-table>
		</div>
	</div>
</template>

<script>
	import addTables from "@/features/restaurant/addTables.vue";

	export default {
		name: "tables",

		components: {
			"add-tables": addTables
		},

		data () {
			this.getTables();
			return {
				error: false,
				msg: '',
				authenticated: this.$store.state.authenticated,
				tables: [],
				tableFields: ["tableIdentifier", "capacity", "description"]
			}
		},

		methods: {
			getTables() {
				console.log('Getting tables');
				this.$http.get(
					process.env.VUE_APP_API_ROUTE + 'table',
					{
						params: {restaurant: this.$route.params.id}
					},
					{
						headers: {
							Authorization: 'Bearer ' + JSON.parse(this.$store.state.user).token}
					}
				).then((response) => {
					console.log(response);
					if (response.ok && response.body.tables) {
						console.log('Tables: ', JSON.stringify(response.body.tables));
						this.tables = response.body.tables;
					} else {
						this.error = true;
						this.msg = (response.body.errors && response.body.errors.message)
							? response.body.errors.message
							: "Could not get the tables";
					}
				}).catch((e) => {
					this.error = true;
					this.msg = (e.body && e.body.errors && e.body.errors.message)
						? e.body.errors.message
						: "Could not get the tables";
					console.log(JSON.stringify(e));
				});
			}
		}
	}
</script>

<style>
.list-table {
	margin-top: 20px;
}
</style>
