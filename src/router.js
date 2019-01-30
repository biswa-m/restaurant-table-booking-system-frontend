import Vue from "vue";
import Router from "vue-router";

import store from "@/store.js";
import home from "@/views/home.vue";
import restaurantOwnerLogin from "@/features/restaurant/login.vue";
import restaurantHome from "@/features/restaurant/home.vue";
import restaurantAdd from "@/features/restaurant/restaurantAdd.vue";

Vue.use(Router);

export const router = new Router({
  routes: [
    {
      path: "/",
      name: "home",
      component: home
    },
    {
      path: "/restaurant/login",
      name: "restaurantOwnerLogin",
      component: restaurantOwnerLogin
		},
    {
      path: "/restaurant",
      name: "restaurant",
      component: restaurantHome
		},
    {
      path: "/restaurant/add",
      name: "restaurantAdd",
      component: restaurantAdd
		},
    {
			path: "/restaurant/:id",
      name: "restaurantDashboard",
      component: () => import(/* webpackChunkName: "restaurantDashboard" */ "@/features/restaurant/restaurantDashboard.vue"),

			children: [
				{
					path: "tables",
					component: () => import("@/features/restaurant/tables.vue")
				}
			]
		},

		// otherwise redirect to home
    { path: '/restaurant/*', redirect: '/restaurant' },
    { path: '*', redirect: '/' }
  ]
});

router.beforeEach((to, from, next) => {
	// Redirect to relavant login page (customer/ restaurant owner)
	// If not logged in as authorized userand trying to access a restricted page

	const customerOnly = [];
	const restauranteursOnly = ['/restaurant/', '/restaurant'];

	const loggedInAs = store.state.authenticated;

	if (restauranteursOnly.includes(to.path) && (loggedInAs != 'restaurant')) {
		console.log('restaurantOnly');
		return next('/restaurant/login');
	} else if (customerOnly.includes(to.path) && (loggedInAs != 'customer')) {
		console.log('customerOnly');
		return next('/login');
	}

	next();
});
