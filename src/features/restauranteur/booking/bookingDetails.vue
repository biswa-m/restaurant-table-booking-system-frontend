<template>
	<b-card class="mb-4">
		<div class="text-center">
			<div v-show="stat=='error'" class="alert alert-warning alert-dismissible" role="alert">
				<strong>Warning! </strong>{{msg}}
			</div>
			<div v-show="stat=='success'" class="alert alert-success alert-dismissible" role="alert">
				<strong>Success! </strong>{{msg}}
			</div>
			<u>Customer Details</u><br/>
			<div class="row">
				<div class="mx-auto my-2">
					<b>{{row.item.customerDetails.name}}</b><br/>
					<small>Email:</small> {{row.item.customerDetails.email}}<br/>
					<small>Phone:</small> {{row.item.customerDetails.phone}}<br/>
				</div>
			</div>
			<b-form @submit.prevent="updateBooking()">
				<b-row class="">
					<b-col md v-if="!row.item.edit" class="flex">
						<span class="my-auto">Date:</span>
						<span class="my-auto ml-2">{{formatTime(row.item.bookingFrom, 1) +' '+ (new Date(row.item.bookingFrom)).toDateString()}}</span>
					</b-col>
					<b-col md class="flex">
						<div v-if="row.item.edit" class="my-1 ml-auto mr-0 w-100">
							<datepicker
								v-model="date"
								input-class="form-control input"
								calendar-class="calendar1"
								:disabledDates="disabledDates"
								placeholder="Select Date"
								@selected="dateSelected"
							>
							</datepicker>
						</div>
						<div v-if="row.item.edit" class="dropdown my-1 ml-auto mr-0 w-100">
							<button class="form-control input"
											type="button"
											data-toggle="dropdown"
											aria-haspopup="true"
											aria-expanded="false">
								{{formatTime(time)}}
								<span v-if="time!=0 && !time"
											class="placeholder">
									Select time
								</span>
							</button>
							<div class="dropdown-menu" aria-labelledby="dropdownMenuButton">
								<div v-if="!date"
										class="text-warning text-center">
									Select date first
								</div>
								<div v-for="slot in timeSlots">
									<a @click="time=slot" class="dropdown-item">{{formatTime(slot)}}</a>
								</div>
							</div>
						</div>
					</b-col>
				</b-row>
				<b-row class="">
					<b-col md=6 class="flex">
						<span class="my-auto">Persons:</span>
						<div class="my-1 ml-2 mr-0">
							<input :class="row.item.edit ? 'form-control input' : 'form-control no-style'"
										v-model="noOfPersons"
										type="number" min="1"
										:disabled="!row.item.edit">
						</div>
					</b-col>
					<b-col md=6 class="flex">
						<span class="my-auto">Table:</span>
						<div v-if="!row.item.edit" class="ml-auto mr-0 my-auto">
							<input class="form-control no-style"
							:value="this.row.item.tables[0].tableIdentifier"
							disabled>
							</input>
						</div>
						<div v-if="row.item.edit" class="ml-2 mr-0 my-auto w-100">
							<button class="form-control input"
											:disabled="!noOfPersons || !date || !time"
											type="button"
											id="dropdownMenuButton"
											data-toggle="dropdown"
											aria-haspopup="true"
											aria-expanded="false">
								<span v-if="table && (table._id || table.id)">
									{{table.tableIdentifier}}
								</span>
								<span v-if="!table || !(table._id || table.id)"
											class="placeholder">
									Automatic Selection
								</span>
							</button>
							<div class="dropdown-menu" aria-labelledby="dropdownMenuButton">
								<a @click="table={}" class="dropdown-item">Automatic Selection</a>
								<div v-for="tableData in tables">
									<a @click="table=tableData" class="dropdown-item">{{tableData.tableIdentifier}}</a>
								</div>
							</div>
						</div>
					</b-col>
				</b-row>
				<div class="mt-2">
					<b-button v-show="!row.item.edit"
										size="sm"
										@click="initEdit"
										class="mr-1">
						Edit
					</b-button>
					<b-button v-show="!row.item.edit"
										size="sm"
										@click="row.toggleDetails(); stat=null; $emit('ok')"
										class="mr-1"
										variant="success">
						Ok
					</b-button>
					<b-button v-show="row.item.edit"
										size="sm"
										@click="cancelEdit"
										class="mr-1">
						Cancel
					</b-button>
					<b-button v-if="row.item.edit"
										size="sm"
										variant="success"
										:disabled="!time || !this.date || !this.noOfPersons"
										type="submit">
						Update
					</b-button>
				</div>
			</b-form>
		</div>
	</b-card>
</template>

<script>
	import datepicker from "vuejs-datepicker";
	import generateTimeSlots from "@/helpers/generateTimeSlots.js";
	import formatTime from "@/helpers/formatTime.js";

	export default {
		name: "booking-details",

		props: ['row', 'disabledDates', 'restaurant', 'days'],

		data() {
			return {
				stat: null,
				msg: '',

				date: this.row.item.bookingFrom,
				noOfPersons: this.row.item.noOfPersons,

				time: null,
				timeSlots: [],
				timeInterval: 30,

				table: this.row.item.tables[0],
				tables: []
			}
		},

		components: {
			datepicker,
		},

		mounted() {
			console.log('Details of selected booking: ', this.row);
		},

		computed: {
			activateTableSelection() {
				if (this.noOfPersons && this.date && this.time) {
					return this.date + this.time + this.noOfPersons;
				}
			}
		},

		watch: {
			activateTableSelection(value) {
				if (value) {
					console.log('Activating table selections');
					this.table = {};
					this.tables = [];
					this.listAvailableTables();
				}
			}
		},

		methods: {
			formatTime: formatTime,

			cancelEdit() {
				// collapse details
				this.row.toggleDetails();
				this.stat = null;

				// Reset changes
				this.noOfPersons = this.row.item.noOfPersons,
				this.date = this.row.item.bookingFrom;
				this.table = this.row.item.tables[0];

				// Disable edit flag
				this.row.item.edit = false;
			},

			updateBooking() {
				console.log('Processing booking updation');

				this.date = (new Date(this.date)).setHours(parseInt(this.time/100), this.time%100 , 0, 0);

				this.$http.put(
					process.env.VUE_APP_API_ROUTE + 'restaurant/booking/' + this.$store.state.restaurant.id + '/' + (this.row.item._id || this.row.item.id),
					{
						booking: {
							bookingFrom: this.date,
							noOfPersons: this.noOfPersons,
							table: this.table.id || this.table._id
						}
					},
					{
						headers: {
							Authorization: 'Bearer ' + JSON.parse(this.$store.state.user).token}
					}
				).then((response) => {
					console.log(response);
					if (response.ok && response.body.booking) {
						console.log('booking updated successfully');
						this.stat = 'success';
						this.msg = 'Booking updated successfully';

						this.row.item.edit = false;

						// Update list
						this.row.item.bookingFrom = response.body.booking.bookingFrom;
						this.row.item.noOfPersons = response.body.booking.noOfPersons;
						this.row.item.tables[0] = response.body.booking.tables[0];

						console.log(this.row);
					} else {
						this.stat = 'error';
						this.msg = (response.body.errors && response.body.errors.message)
							? response.body.errors.message
							: "something not right!";
					}
				}).catch((e) => {
					this.stat = 'error';
					this.msg = (e.body && e.body.errors && e.body.errors.message)
						? e.body.errors.message
						: "Booking Failed";
					console.log('Booking failed: ', JSON.stringify(e));
				});
			},

			initEdit() {
				// Set edit flag
				this.row.item.edit = true;
				this.date = this.row.item.bookingFrom;
				this.time = this.formatTime(this.row.item.bookingFrom, 'date', 'returnHHMM');
				this.table = this.row.item.tables[0]
				this.stat = null;

				// Generate availabe time slots
				let bHours = this.restaurant.businessHours[this.days[(new Date(this.row.item.bookingFrom)).getDay()]];
				this.timeSlots = generateTimeSlots(bHours.start, bHours.end, this.timeInterval, new Date(this.row.item.bookingFrom));
			},
			
			dateSelected(value) {
				console.log('Selected', value);

				// Reset selected time since available time slots may differ
				this.time = null;

				// Generate availabe time slots
				let bHours = this.restaurant.businessHours[this.days[value.getDay()]]
				this.timeSlots = generateTimeSlots(bHours.start, bHours.end, this.timeInterval, value);
			},

			listAvailableTables() {
				console.log('Getting Lists of tables..');

				let time = this.time ? this.time : 0;
				let date = this.date;
				console.log('Date', date, 'Time: ', time);

				date = date
					? (time
						? ((new Date(date)).setHours(parseInt(time/100), time%100 , 0, 0))
						: (new Date(date)).getTime())
					: Date.now();
				console.log('Date', date);

				this.$http.get(
					process.env.VUE_APP_API_ROUTE + 'restaurant/tables/' + this.restaurant.id,
					{
						params: {
							availability: 'available',
							bookingId: this.row.item._id,
							date: date,
							mincapacity: this.noOfPersons},
						headers: {
							Authorization: 'Bearer ' + JSON.parse(this.$store.state.user).token
						}
					}
				).then(response => {
					console.log('Response: ', response);
					if (response && response.body && response.body.tables) {
						this.tables = response.body.tables;
					}
				}).catch(e => {
					console.log('Error listing tables: ', e);
				});
				}
		}
	}
</script>

<style>
	.placeholder {
		color: #444a;
	}
	.dropdown-menu {
		height: auto;
		max-height: 230px;
		overflow-x: hidden;
	}
	.no-style {
		background: 0 !important;
		border-style: none !important;
	}
	.flex {
		display: flex;
}
</style>
