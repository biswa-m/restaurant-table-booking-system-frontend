import Vue from "vue";
import Router from "vue-router";

import home from "@/views/home.vue";
import restaurantOwnerLogin from "@/features/restaurantOwnerLogin.vue";

Vue.use(Router);

export default new Router({
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
      component: home 
		},

		// otherwise redirect to home
    //{ path: '*', redirect: '/' }
  ]
});
