<script setup lang="ts">
import {useWeatherStore} from "@/stores/weather";
import LocationWeather from "@/components/LocationWeather.vue";
import {useRouter} from "vue-router";
import IconButton from "@/components/IconButton.vue";

const router = useRouter();
const weatherStore = useWeatherStore();

function openSettings(): void {
	router.push({ name: "Settings" });
}
</script>

<template>
  <div
			v-if="weatherStore.locations.length === weatherStore.weather.length"
			class="weather-widget__main-container"
	>
		<LocationWeather
				v-for="(_, index) in weatherStore.locations.length"
				:key="weatherStore.weather[index]?.id"
				:location="weatherStore.locations[index]"
				:weather="weatherStore.weather[index]"
		/>
		<div v-if="weatherStore.locations.length === 0">
			<h3>No locations added yet.</h3>
			<p>
				Add a location by clicking the cog icon in the top right corner.
			</p>
		</div>
		<IconButton
				class="weather-widget__settings-button"
				icon="settings"
				@click="openSettings"
		/>
  </div>
</template>

<style scoped lang="scss">
.weather-widget {
	&__main-container {
		display: flex;
		flex-direction: column;
		gap: 48px;
		position: relative;
	}

	&__settings-button {
		position: absolute;
		top: 6px;
		right: 6px;
	}
}
</style>
