<template>
	<div class="booking-restauranteur">
		<h3 class="text-left">
			<small>{{selectedList}} of </small>
			<b>{{$store.state.restaurant.name}}</b>
		</h3>
		<hr/>
		<div v-show="error" class="alert alert-warning alert-dismissible mx-auto" role="alert">
			<strong>{{msg}}</strong>
		</div>
		<div class="my-3">
			<b-form v-show="searchMenu" class="form">
				<b-row>
					<b-col md="6">
						<span class="label">Customer phone number</span>
						<b-form-input class="input" type="number" v-model="params.phone" placeholder="phone"/>
					</b-col>
					<b-col md="6">
						<span class="label">Customer email</span>
						<b-form-input class="input" type="email" min=1 v-model="params.email" placeholder="email"/>
					</b-col>
				</b-row>
				<b-row>
					<b-col md="6">
						<span class="label">No of persons</span>
						<b-form-input class="input" type="number" v-model="params.noOfPersons" placeholder="persons"/>
					</b-col>
					<b-col md="6">
						<span class="label">table</span>
						<div class="dropdown">
							<button class="form-control input"
											type="button"
											data-toggle="dropdown"
											aria-haspopup="true"
											aria-expanded="false">
								{{table.tableIdentifier}}
								<span v-if="!table.id" class="placeholder">Select table</span>
							</button>
							<div class="dropdown-menu" aria-labelledby="dropdownMenuButton">
								<div v-for="tableData in tables">
									<a @click="table=tableData" class="dropdown-item">{{tableData.tableIdentifier}}</a>
								</div>
							</div>
						</div>
					</b-col>
				</b-row>
				<b-row>
					<b-col md="6">
						<span class="label">Starting Date</span>
						<datepicker
							v-if="disabledDates"
							v-model="after"
							input-class="input input-date"
							calendar-class="calendar1"
							placeholder="Select date"
							:clear-button="true"
							clear-button-icon="fa fa-times"
						>
						</datepicker>
					</b-col>
					<b-col md="6">
						<span class="label">Ending Date</span>
						<datepicker
							v-if="disabledDates"
							v-model="before"
							input-class="input input-date"
							calendar-class="calendar1"
							placeholder="Select date"
							:clear-button="true"
							clear-button-icon="fa fa-times"
						>
						</datepicker>
					</b-col>
				</b-row>
				<b-row class="my-2">
					<div class="col-sm-3 text-left text-sm-right">
						<b>Booking Status:</b>
					</div>
					<div class="col-sm-9">
						<b-form-checkbox-group v-model="params.bookingStatus"
							:options="['pending', 'confirmed', 'canceled']">
						</b-form-checkbox-group>
					</div>
				</b-row>
			</b-form>
			<b-row>
				<div class="mx-auto">
					<a v-show="searchMenu" class="btn btn-md btn-link mx-1" @click="resetData">
						Reset
					</a>
					<button class="btn btn-md btn-primary submit-button"
						@click="searchBookings">
						<b>Search Bookings</b>
					</button>
				</div>
			</b-row>
		</div>
		<div v-if="searchResult && !bookings.length">
			<hr/>
			<div class="alert alert-warning alert-dismissible mx-auto" role="alert">
				<strong>No bookings found</strong>
			</div>
		</div>
		<div v-if="searchResult && bookings.length">
			<hr/>
			<div class="row mr-1">
				<div class="ml-auto mr-1">
					<b-dropdown variant="outline-info btn-sm" class="">
						<template slot="button-content">
							Sort By <b>{{sortKeys[sortby]}}</b>
						</template>
						<b-dropdown-item @click="sort('bookingFrom', sortby=='bookingFrom')">
							Date<small v-show="sortby=='bookingFrom'"> ({{oppSortOrder()}})</small>
						</b-dropdown-item>
						<b-dropdown-item @click="sort('noOfPersons', sortby=='noOfPersons');">
							Persons<small v-show="sortby=='noOfPersons'"> ({{oppSortOrder()}})</small>
						</b-dropdown-item>
						<b-dropdown-item @click="sort('bookingStatus', sortby=='bookingStatus');">
							Status<small v-show="sortby=='bookingStatus'"> ({{oppSortOrder()}})</small>
						</b-dropdown-item>
					</b-dropdown>
				</div>
			</div>
			<b-row class="mt-1">
				<b-col md=9>
					<div>
						<b-pagination
							:limit="8"
							:total-rows="count"
							:per-page="limit"
							v-model="currentPage"
							class="my-0"
							@change="paginate"
						/>
					</div>
				</b-col>
				<b-col md=3 class="flex">
					<span class="my-auto ml-0 mr-2">Per Page</span>
					<b-form-select :options="pageOptions" class="per-page" v-model="limit" />
				</b-col>
			</b-row>
			<booking-list :restaurant="$store.state.restaurant"
											:bookings="bookings"
											:disabledDates="disabledDates">
			</booking-list>
			<b-row class="mt-1">
				<b-col md=9>
					<div>
						<b-pagination
							:limit="8"
							:total-rows="count"
							:per-page="limit"
							v-model="currentPage"
							class="my-0"
							@change="paginate"
						/>
					</div>
				</b-col>
				<b-col md=3 class="flex">
					<span class="my-auto ml-0 mr-2">Per Page</span>
					<b-form-select :options="pageOptions" class="per-page" v-model="limit" />
				</b-col>
			</b-row>
		</div>
	</div>
</template>

<script>
	import bookingList from "@/features/restauranteur/booking/bookingList.vue"
	import datepicker from "vuejs-datepicker";

	export default {
		name: "select-booking-list",

		props: {
			disabledDates: {}
		},

		components: {
			'booking-list': bookingList,
			datepicker
		},

		data () {
			return {
				error: false,
				msg: '',

				selectedList: 'Search bookings',

				tables: [],
				table: {},
				before: null,
				after: null,
				params: {},

				bookings: [],

				pageOptions: [5, 10, 15, 20, 25, 30],
				count: 0,
				limit: 20,
				skip: 0,
				currentPage: 0,

				sortby: 'bookingFrom',
				sortOrder: 1,
				sortKeys: {
					'bookingFrom': 'Date',
					'bookingStatus': 'Status',
					'noOfPersons': 'Persons'
				},

				searchResult: false,
				searchMenu: true 
			}
		},

		watch: {
			limit(value) {
				this.skip = 0;
				this.currentPage = 1;
				this.getBookings(this.params);
			},
		},

		mounted() {
			console.log('Getting tables');
			this.$http.get(
				process.env.VUE_APP_API_ROUTE + 'table',
				{
					params: {restaurant: this.$store.state.restaurant.id},
					headers: {
						Authorization: 'Bearer ' + JSON.parse(this.$store.state.user).token
					}
				}
			).then((response) => {
				console.log('Table: ', response);
				if (response.ok && response.body.tables) {
					this.tables = response.body.tables;
				}
			}).catch((e) => {
				console.log('Couldnot get the tables', JSON.stringify(e));
			});
		},

		methods: {
			getBookings(params) {
				params.skip = this.skip;
				params.limit = this.limit;
				console.log('Getting bookings: ', JSON.stringify(params));
				this.$http.get(
					process.env.VUE_APP_API_ROUTE + 'restaurant/bookings/' + this.$store.state.restaurant.id,
					{
						params,
						headers: {
							Authorization: 'Bearer ' + JSON.parse(this.$store.state.user).token
						}
					}
				).then((response) => {

					this.searchResult = true;
					this.searchMenu = false;

					console.log(response);
					if (response.ok && response.body.bookings) {
						// Add customerDetails key to view details of customer on each booking 
						// Add _showDetails key to toggle details on each booking 
						// Add rowVariant key to change style of each booking depending on booking status
						this.bookings = response.body.bookings.map(x => {
							x.customerDetails = {};
							x._showDetails = false ;
							x._rowVariant = (x.bookingStatus == 'confirmed')
								? 'success'
								: (x.bookingStatus == 'canceled')
									? 'active'
									: 'warning';
							return x;
						});

						// Total no of booking
						this.count = response.body.count
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

			paginate(page) {
				this.skip = (page - 1) * this.limit;
				this.getBookings(this.params);
				console.log('Page number: ', page, 'skip: ', this.skip);
			},

			sort(sortby, order) {
				// if requesting to sort the same row, reverse the sorting order
				this.sortOrder = order ? this.sortOrder * -1 : 1;
				this.params.sortby=[[sortby, this.sortOrder]];

				this.sortby = sortby;

				this.getBookings(this.params);
			},

			oppSortOrder() {
				return (this.sortOrder == -1) ? 'ascending' : 'descending'
			},

			searchBookings() {
				if (!this.searchMenu) return this.searchMenu = true;

				if (this.table.id) {
					this.params.table = this.table.id;
				}
				if (this.after) {
					this.params.after = this.after.getTime();
				}
				if (this.before) {
					this.params.before = this.before.getTime();
				}
				console.log('Searching bookings..', this.params);

				this.getBookings(this.params);
			},

			resetData() {
				this.error = false,
				this.msg = null,

				this.searchResult = false,
				this.bookings = [],

				this.table = {},
				this.before = null,
				this.after = null,
				this.params = {},

				this.sortby = 'bookingFrom',
				this.sortOrder = 1
			},
		}
	}
</script>

<style>
	.input {
		margin: 10px 0 10px 0; 
		height: 50px;
		background: #f7ebd7 !important;
		text-align: left;
		border: 1px solid #3333;
	}
	.label {
		padding-left: 10px;
	}
	.form {
		text-align: left;
	}
	.calendar1 {
		max-width: 100%;
		min-width: 200px;
	}
	.dropdown-menu {
		height: auto;
		max-height: 230px;
		overflow-x: hidden;
	}
	.horizontal-label {
		padding: 13px 10% 0 5%;
		margin-top: 9px;
		text-align: right;
	}
	.submit-button {
		background: #f0ad4e;
		border-color: #f0ad4e;
		color: #ffffff;
		margin: 10px;
		width: 200px;
	}
	.submit-button:disabled {
		background: #dbb77a
	}
	.input-date {
		width: 90%;
		border-radius: 4px;
		padding-left: 3%;
		color: #495057;
	}
</style>
