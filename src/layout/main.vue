<template>
	<div class = "layout">
		<appHeader/>
		<loginScreen v-if="$store.state.loginScreen" @close="hideLoginScreen"/>
	</div>
</template>

<script>
import appHeader from "@/components/app-header.vue"
import loginScreen from "@/features/login.vue"

export default {
	name: "defaultLayout",
	components: {
		appHeader,
		loginScreen
	},
	methods: {
    hideLoginScreen: function() {
      this.$store.commit('hideLoginScreen')
    }
  }
}
</script>
