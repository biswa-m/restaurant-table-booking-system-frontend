<template>
	<div id="dashboard" class="text-left" :style="collapsedPadding">
		<div class="dashboard text-center">
			<router-view></router-view>
		</div>
		<sidebar-menu id="sidebar"
			:menu="menu"
			:collapsed="collapsed"
			@collapse="onCollapse"
			@itemClick="onItemClick"
			width="250px"
			style="padding-top:60px; z-index:1;"/>
	</div>
</template>

<script>
	import {SidebarMenu} from 'vue-sidebar-menu';
	import 'vue-sidebar-menu/dist/vue-sidebar-menu.css';

	export default {
		name: "restaurantDashboard",

		components: {
			'sidebar-menu': SidebarMenu
		},

		data() {
			const collapsed = (window.innerWidth < 950) ? true : false;
			const collapsedPadding = collapsed ? 'padding-left:50px' : 'padding-left:250px;'
			return {
				collapsed: collapsed,
				collapsedPadding: collapsedPadding,
				windowInnerWidth: window.innerWidth,
				menu: [
					{
						href: '/restaurant/',
						title: 'Dashboard',
						icon: 'fa fa-user'
					},
					{
						href: '/restaurant/booking',
						title: 'Bookings',
						icon: 'fa fa-calendar',
						child: [
							{
								href: '/restaurant/booking',
								title: 'Upcoming bookings',
							},
							{
								href: '/restaurant/booking',
								title: 'Past bookings',
							},
							{
								href: '/restaurant/booking/add',
								title: 'Add bookings',
							},
							{
								href: '/restaurant/booking/search',
								title: 'Search bookings',
							},
							{
								href: '/restaurant/booking',
								title: 'All bookings',
							},
						]
					},
					{
						href: '/restaurant/tables',
						title: 'Tables',
						icon: 'fa fa-coffee'
					},
					{
						href: '/restaurant/home',
						title: 'Restaurants',
						icon: 'fa fa-users'
					}
				]
			}
		},

		beforeMount() {
			if (!this.$store.state.restaurant.id) {
				console.log('No selected restaurant found. Redirecting..');
				return this.$router.push({name: 'restaurantList'});
			}
		},

		mounted(){
			window.addEventListener("resize", ()=> {
				this.windowInnerWidth = window.innerWidth;

				var previousCollapsed = this.collapsed;
				this.collapsed = (window.innerWidth < 950) ? true : false;

				if (this.collapsed != previousCollapsed)
					this.changePadding();
			});
		},

		methods: {
			changePadding() {
				this.collapsedPadding = this.collapsed ? 'padding-left:50px' : 'padding-left:250px;'
			},

			onCollapse(val) {
				console.log(`collapsed ${val}`);
				this.collapsed = val;
				this.changePadding();
			},

			onItemClick(event, item) {
				this.$store.commit('selectBookingList', item.title);
			}
		}
	}
</script>

<style>

.dashboard {
	padding-left: 2%;
	padding-right: 2%;
}
</style>
