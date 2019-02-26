<template>
	<div class="mx-auto">
		<form class="form-box">
		<div v-for="(table, index) in newTables" class="model">
			<button type="button" class="close" @click="cancelTable(index)" aria-label="Close">
				<span aria-hidden="true">&times;</span>
			</button>
			<div class="row no-gutters">
			<div class="col-md-1">
				<div class="table-index mx-auto">
				{{index + 1}}.
				</div>
			</div>
			<div class="col-md-3">
				<div class="input-box">
					<b-form-input type="text"
												v-model="newTables[index].tableIdentifier"
												:state="table.state0"
												placeholder="identifier"
												class="table-input">
					</b-form-input>
				</div>
			</div>
			<div class="col-md-3">
				<div class="input-box">
					<b-form-input type="number"
												v-model="newTables[index].capacity"
												:state="table.state1"
												placeholder="capacity"
												class="table-input"
												v-if>
					</b-form-input>
				</div>
			</div>
			<div class="col-md-5">
				<div class="input-box">
					<b-form-input type="text"
												v-model="newTables[index].description"
												placeholder="description"
												class="table-input">
					</b-form-input>
				</div>
			</div>
		</div>
		</div>
		</form>
		<div class="row">
			<div v-show="error" class="alert alert-warning alert-dismissible" role="alert">
				<strong>{{msg}}</strong>
			</div>
		</div>
		<div class="row">
			<div class="restaurant mx-auto">
				<button @click="addTable" class="btn btn-md btn-primary" style="margin-right:5px">{{add.btn}}</button>
				<button @click="resetAddTable"v-show="add.status" class="btn btn-md btn-secondary">Cancel</button>
				<button @click="submitTables"v-show="add.status" class="btn btn-md btn-primary">Submit</button>
			</div>
		</div>
	</div>
</template>

<script>
	export default {
		name: "addTables",

		data() {
			return {
				add: {
					btn: "Add Tables",
					status: false
				},
				newTables: [],
				error: false,
				msg: ''
			}
		},
		methods: {
			addTable() {
				this.add.status = true;
				this.add.btn = "Add More Tables";
				this.newTables.push({
					tableIdentifier: "",
					capacity: "",
					description: "",
					state0:undefined,
					state1:undefined
				});
				console.log(JSON.stringify(this.newTables));
			},

			resetAddTable() {
				this.newTables = [];
				this.add.status = false;
				this.add.btn = "Add Tables"
			},

			cancelTable(index) {
				this.newTables.splice(index, 1);
				console.log('selected: ', index);
				console.log('length: ', this.newTables.length);
				console.log(JSON.stringify(this.newTables));

				if (!this.newTables.length) {
					this.resetAddTable();
				}
			},

			submitTables() {
				var tables = [];
				var error = false;

				this.newTables.forEach(function(table) {
					if (!table.tableIdentifier) {
						table.state0 = false;
						error = true;
					}	else {
						table.state0 = undefined;
					}

					if (!table.capacity || table.capacity <= 0) {
						table.state1 = false;
						error = true;
					} else {
						table.state1 = undefined;
					}

					tables.push({
						tableIdentifier: table.tableIdentifier,
						capacity: table.capacity,
						description: table.description
					});
				});

				if (error) {
					console.log("validation Error");
					return;
				}

				this.$http.post(
					process.env.VUE_APP_API_ROUTE + 'restaurant/table/' + this.$store.state.restaurant.id,
					{
						tables: tables
					},
					{
						headers: {
							Authorization: 'Bearer ' + JSON.parse(this.$store.state.user).token}
					}
				).then((response) => {
					console.log(response);
					if (response.ok) {
						this.resetAddTable();
						console.log('Tables are added');
						this.$emit('addtables');
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
			}
		}
	}
</script>

<style>
.btn: {
	margin-left: 10px;
}
.table: {
	padding: 20px 20px 20px 20px;
}
.input-box {
	margin: 5px 0 5px 0;	
}
.table-index {
	padding-top: 12px;
}
.close {
	margin-top: 10px;
	margin-left: 10px;
	color: #922;
}
</style>
