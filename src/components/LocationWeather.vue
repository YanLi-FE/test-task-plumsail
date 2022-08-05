<script setup lang="ts">
import type {ApiLocationLookupResponseObject, ApiWeatherResponseObject} from "@/stores/weather";
import {computed} from "vue";

const props = defineProps<{
	location: ApiLocationLookupResponseObject;
	weather: ApiWeatherResponseObject;
}>();

const locationFullName = computed(() => `${props.location.name}, ${props.location.country}`);
const weatherIconUrl = computed(() => `https://openweathermap.org/img/wn/${props.weather.weather[0].icon}@4x.png`);
const weatherDescription = computed(() => {
	const description = props.weather.weather[0].description;
	return description[0].toUpperCase() + description.slice(1);
});
const weatherTemperature = computed(() => `${Math.round(props.weather.main.temp)}°C`);
const weatherFeelsLike = computed(() => `${Math.round(props.weather.main.feels_like)}°C`);
const weatherDirections = [
		'N', 'NNE', 'NE', 'ENE', 'E', 'ESE', 'SE', 'SSE',
		'S', 'SSW', 'SW', 'WSW', 'W', 'WNW', 'NW', 'NNW',
		'N',
];
const weatherWindSpeed = computed(() => `${props.weather.wind.speed}m/s`);
const weatherWindDirection = computed(() => {
	const direction = props.weather.wind.deg;
	const index = Math.floor((direction + 11.25) / 22.5);
	return weatherDirections[index];
});
const weatherVisibility = computed(() => {
	const distance = props.weather.visibility;
	if (distance < 1000) {
		return `${distance}m`;
	} else {
		return `${(distance / 1000).toFixed(1)}km`;
	}
});
</script>

<template>
	<div class="weather-widget__location-container">
		<h3 class="weather-widget__location-name">{{ locationFullName }}</h3>
		<img :src="weatherIconUrl" class="weather-widget__weather-icon" :alt="weatherDescription" />
		<div class="weather-widget__temperature">{{ weatherTemperature }}</div>
		<div class="weather-widget__short-description">
			Feels like {{ weatherFeelsLike }}.
			{{ weatherDescription }}.
		</div>
		<div class="weather-widget__additional-info">
			<i
					:style="{'--degrees': weather.wind.deg}"
					class="material-symbols-outlined weather-widget__wind-direction-icon"
			>arrow_upward</i>
			{{ weatherWindSpeed }}
			{{ weatherWindDirection}}
		</div>
		<div class="weather-widget__additional-info">
			<i class="material-symbols-outlined">compress</i>
			{{ weather.main.pressure }}hPa
		</div>
		<div class="weather-widget__additional-info">
			Humidity: {{ weather.main.humidity }}%
		</div>
		<div class="weather-widget__additional-info">
			Visibility: {{weatherVisibility}}
		</div>
	</div>
</template>

<style scoped lang="scss">
.weather-widget {
	&__location-container {
		display: grid;
		grid-template-columns: repeat(2, 1fr);
		gap: 16px;
	}

	&__location-name {
		font-size: 18px;
		font-weight: bold;
		margin: 12px 0;
	}

	&__location-name,
	&__short-description {
		grid-column: 1 / 3;
	}

	&__weather-icon {
		width: 142px;
		aspect-ratio: 1;
		object-fit: contain;
	}

	&__temperature {
		display: grid;
		place-items: center;
		font-size: 36px;
		font-weight: bold;
	}

	&__additional-info {
		display: flex;
		gap: 4px;
		align-items: center;
	}

	&__wind-direction-icon {
		--degrees: 0;
		transform-origin: center;
		transform: rotate(calc(var(--degrees) * 1deg));
	}
}
</style>
