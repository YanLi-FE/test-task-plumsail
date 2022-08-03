<script setup lang="ts">
import { RouterView } from 'vue-router';
</script>

<template>
	<div class="weather-widget">
		<RouterView />
	</div>
</template>

<style scoped lang="scss">
.weather-widget {
	background-color: red;
	height: 100px;
	width: 80px;
}
</style>
