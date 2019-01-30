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
			return {
				collapsed: false,
				collapsedPadding: 'padding-left:350px',
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

		methods: {
			onCollapse(val) {
				console.log(`collapsed ${val}`)
				this.collapsed = val
				this.collapsedPadding = val ? 'padding-left:50px' : 'padding-left:350px;'
			}
		}
	}
</script>

<style>

.dashboard {
	padding-left: 5%;
}
</style>
