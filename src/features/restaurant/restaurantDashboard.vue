<template>
	<div id="dashboard" :style="collapsedPadding">
		<div class="dashboard">
			<router-view></router-view>
		</div>
		<sidebar-menu id="sidebar" :menu="menu" :collapsed="collapsed" @collapse="onCollapse" style="padding-top:60px"/>
	</div>
</template>

<script>
	import Router from "vue-router";
	import {SidebarMenu} from 'vue-sidebar-menu';
	import 'vue-sidebar-menu/dist/vue-sidebar-menu.css';

	export default {
		name: "restaurantDashboard",

		components: {
			'sidebar-menu': SidebarMenu
		},

		data() {
			const id = this.$route.params.id;
			const collapsed = (window.innerWidth < 950) ? true : false;
			const collapsedPadding = collapsed ? 'padding-left:50px' : 'padding-left:350px;'
			return {
				collapsed: collapsed,
				collapsedPadding: collapsedPadding,
				windowInnerWidth: window.innerWidth,
				menu: [
					{
						href: '/restaurant/' + id + '',
						title: 'Dashboard',
						icon: 'fa fa-user'
					},
					{
						href: '/restaurant/' + id + '/tables',
						title: 'Tables',
						icon: 'fa fa-coffee'
					}
				]
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
				this.collapsedPadding = this.collapsed ? 'padding-left:50px' : 'padding-left:350px;'
			},

			onCollapse(val) {
				console.log(`collapsed ${val}`);
				this.collapsed = val;
				this.changePadding();
			}
		}
	}
</script>

<style>

.dashboard {
	padding-left: 5%;
}
</style>
