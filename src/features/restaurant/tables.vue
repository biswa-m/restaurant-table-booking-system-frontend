<template>
	<div v-show="authenticated=='restaurant'"class="table" style="background:#f5f5f5">
		<add-tables></add-tables>
	</div>
</template>

<script>
	import addTables from "@/features/restaurant/addTables.vue";

	export default {
		name: "tables",

		components: {
			"add-tables": addTables
		},

		data () {
			return {
				authenticated: this.$store.state.authenticated,
			}
		}
	}
</script>
