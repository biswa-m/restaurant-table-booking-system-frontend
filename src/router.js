import Vue from "vue";
import Router from "vue-router";

import store from "@/store.js";

import home from "@/features/customer/home.vue";
import restaurantOwnerLogin from "@/features/restauranteur/login.vue";

Vue.use(Router);

export const router = new Router({
  routes: [
    {
      path: "/",
      name: "home",
      component: home
    },
    {
      path: "/login",
      name: "login",
      component: () => import("@/features/customer/login/page.vue"),
    },
    {
      path: "/bookings",
      name: "customerBookings",
      component: () => import("@/features/customer/booking/listBookings.vue"),
    },
    {
      path: "/restaurant/login",
      name: "restaurantOwnerLogin",
      component: restaurantOwnerLogin
		},
    {
      path: "/restaurant/home",
      name: "restaurantList",
      component: () => import(/* webpackChunkName: "restaurantDashboard" */ "@/features/restauranteur/restaurants/index.vue"),
		},
    {
      path: "/restaurant/add",
      name: "restaurantAdd",
      component: () => import(/* webpackChunkName: "restaurantDashboard" */ "@/features/restauranteur/restaurants/restaurantAdd.vue"),
		},
    {
			path: "/restaurant",
      component: () => import(/* webpackChunkName: "restaurantDashboard" */ "@/features/restauranteur/home.vue"),

			children: [
				{
					path: "/",
					name: "restaurantDashboard",
					component: () => import(/* webpackChunkName: "restaurantDashboard" */ "@/features/restauranteur/dashboard/index.vue")
				},
				{
					path: "tables",
					component: () => import(/* webpackChunkName: "restaurantDashboard" */ "@/features/restauranteur/table/tables.vue")
				},
				{
					path: "booking",
					component: () => import(/* webpackChunkName: "restaurantDashboard" */ "@/features/restauranteur/booking/index.vue"),

					children: [
						{
							path: "",
							component: () => import(/* webpackChunkName: "restaurantDashboard" */ "@/features/restauranteur/booking/selectList.vue"),
						},
						{
							path: "add",
							component: () => import(/* webpackChunkName: "restaurantDashboard" */ "@/features/restauranteur/booking/bookingAdd.vue")
						},
						{
							path: "search",
							component: () => import(/* webpackChunkName: "restaurantDashboard" */ "@/features/restauranteur/booking/search.vue")
						}
					]
				},
			]
		},
    {
			path: "/:restaurant",
      name: "restaurantDetails",
      component: () => import("@/features/customer/restaurant/restaurantDetails.vue"),
    },

		// otherwise redirect to home
    { path: '/restaurant/*', redirect: '/restaurant' },
    { path: '*', redirect: '/' }
  ]
});

router.beforeEach((to, from, next) => {
	// Redirect to relavant login page (customer/ restaurant owner)
	// If not logged in as authorized user and trying to access a restricted page
	const publicAcess = ['/restaurant/login', '/login', '/' ]
	const restauranteursOnly = ['/restaurant/', '/restaurant'];
	const customerOnly = [];

	const loggedInAs = store.state.authenticated;

	if (!publicAcess.includes(to.path)){
		// only restauranteurs has access but not logged in as restauranteurs
		if((/^\/restaurant\//.test(to.path) || restauranteursOnly.includes(to.path)) && (loggedInAs != 'restaurant')) {
			console.log('Page restricted to restauranteurs only. Redirecting to login.');
			return next('/restaurant/login');
		// only customer has access but not logged in as customer
		} else if (customerOnly.includes(to.path) && (loggedInAs != 'customer')) {
			console.log('Page restricted to customer only. Redirecting to login.');
			return next('/login');
		// public acess to '/:restaurantId'
		} else if (/^\/(?=[a-f\d]{24}$)(\d+[a-f]|[a-f]+\d)/.test(to.path)) {
			return next();
		// only customer or restauranteurs have access but not logged in
		} else if (!loggedInAs) {
			console.log('Restricted page. Redirecting to login.');
			return next('/login');
		}

	}
	next();
});
