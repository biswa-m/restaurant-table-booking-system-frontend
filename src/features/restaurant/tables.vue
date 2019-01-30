<template>
	<div v-show="authenticated=='restaurant'"class="container" style="background:#fff">
		<div class=row>
			<add-tables v-on:addtables="getTables"></add-tables>
		</div>
		<div class="row list-table">
			<div v-show="error" class="alert alert-warning alert-dismissible mx-auto" role="alert">
				<strong>{{msg}}</strong>
			</div>
			<b-table responsive striped hover :items="tables" :fields="tableFields">
				<template slot="actions" slot-scope="row">
					<!-- We use @click.stop here to prevent a 'row-clicked' event from also happening -->
					<b-button size="sm" variant="link" @click.stop="row.toggleDetails" class="mr-1" title="Edit">
						Edit
					</b-button>
					<b-button size="sm" variant="" @click.stop="deleteTable(row.item.id)" class="mr-1" title="Delete">
						<i class="fas fa-trash" aria-hidden="true"></i>
					</b-button>
				</template>
					<template slot="row-details" slot-scope="row">
						<b-card>
							<b-form @submit.prevent="updateTable(row.item, row.toggleDetails)" @reset="row.toggleDetails">
								<div class="row">
									<div class="col-md-6">
										<b-form-group label="Table Identifier">
											<b-form-input type="text" v-model="row.item.newTableIdentifier" placeholder="table indetifier" :value="row.item.tableIdentifier" required>
											</b-form-input>
										</b-form-group>
									</div>
									<div class="col-md-6">
										<b-form-group label="Capacity">
											<b-form-input type="number" min=1 v-model="row.item.newCapacity" placeholder="capacity" :value="row.item.capacity" required>
											</b-form-input>
										</b-form-group>
									</div>
								</div>
								<div class="row">
									<div class="col-md">
										<b-form-group label="Description">
											<b-form-input type="text" v-model="row.item.newDescription" placeholder="description" :value="row.item.description">
											</b-form-input>
										</b-form-group>
									</div>
								</div>
								<b-button size="sm" @click="row.toggleDetails" class="mr-1">Cancel</b-button>
								<b-button size="sm" variant="success" type="submit" >Update</b-button>
							</b-form>
						</b-card>
					</template>
			</b-table>
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
				tableFields: ["tableIdentifier", "capacity", "description", "actions"]
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
			},

			updateTable(item, toggleDetails) {
				if (!item.newTableIdentifier && !item.newCapacity && !item.newDescription) {
					toggleDetails();
					console.log('Nothing to update');
					return;
				}
				console.log('Updating Table');

				this.$http.put(
					process.env.VUE_APP_API_ROUTE + 'table',
					{
						table: {
							id: item.id,
							tableIdentifier: item.newTableIdentifier,
							capacity: item.newCapacity,
							description: item.newDescription
						}
					},
					{
						headers: {
							Authorization: 'Bearer ' + JSON.parse(this.$store.state.user).token}
					}
				).then((response) => {
					console.log(response);
					if (response.ok && response.body.table) {
						console.log('Table updated successfully: ', JSON.stringify(response.body.table));
						item.tableIdentifier = response.body.table.tableIdentifier;
						item.capacity = response.body.table.capacity;
						item.description = response.body.table.description;
						toggleDetails();
					} else {
						this.error = true;
						this.msg = (response.body.errors && response.body.errors.message)
							? response.body.errors.message
							: "something not right";
					}
				}).catch((e) => {
					this.error = true;
					this.msg = (e.body && e.body.errors && e.body.errors.message)
						? e.body.errors.message
						: "Could not update the table";
					console.log(JSON.stringify(e));
				});
			},

			deleteTable(id) {
				console.log('Delete operation is not ready yet, Delete request recieved for table: ', id);
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
</style>
