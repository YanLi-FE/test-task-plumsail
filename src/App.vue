<script setup lang="ts">
import {RouterView} from 'vue-router';
import {onMounted} from "vue";
import {useWeatherStore} from "@/stores/weather";

const weatherStore = useWeatherStore();

onMounted(weatherStore.initOnPageLoad);
</script>

<template>
	<div class="weather-widget">
		<RouterView />
	</div>
</template>

<style>
@import url("https://fonts.googleapis.com/css2?family=Material+Symbols+Outlined:opsz,wght,FILL,GRAD@48,400,0,0");

weather-widget {
	display: inline-block;
}
</style>

<style lang="scss" scoped>
.weather-widget {
	font-family: 'Roboto', sans-serif;
	width: 300px;
	margin: 0 auto;
	color: #242322;
}
</style>
