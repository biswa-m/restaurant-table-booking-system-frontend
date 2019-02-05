import Vue from "vue";
import Router from "vue-router";

import store from "@/store.js";

import home from "@/features/customer/home.vue";
import restaurantOwnerLogin from "@/features/restaurant/login.vue";
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
      path: "/login",
      name: "login",
      component: () => import(/* webpackChunkName: "customer" */ "@/features/customer/login/page.vue"),
    },
    {
      path: "/restaurant/login",
      name: "restaurantOwnerLogin",
      component: restaurantOwnerLogin
		},
    {
      path: "/restaurant",
      name: "restaurant",
      component: () => import(/* webpackChunkName: "restauranteur" */ "@/features/restaurant/home.vue"),
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
