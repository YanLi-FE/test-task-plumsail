<script setup lang="ts">
import {useRouter} from "vue-router";
import LocationInSettings from "@/components/LocationInSettings.vue";
import IconButton from "@/components/IconButton.vue";
import {useWeatherStore} from "@/stores/weather";
import type {ApiLocationLookupResponseObject} from "@/stores/weather";
import {ref} from "vue";
import Draggable from "vuedraggable";

const router = useRouter();
const weatherStore = useWeatherStore();

const newLocationName = ref("");
const isLoading = ref(false);

function closeSettings(): void {
	router.push({ name: "Home" });
}

function deleteLocation(index: number): void {
	weatherStore.deleteLocation(index);
}

async function addNewLocation(): Promise<void> {
	if (newLocationName.value.trim().length < 3) {
		alert("Please enter more than 3 characters.");
		return;
	}
	isLoading.value = true;
	try {
		await weatherStore.addLocationByName(newLocationName.value);
		newLocationName.value = "";
	} catch {
		alert("Couldn't add specified location.");
	} finally {
		isLoading.value = false;
	}
}

function getLocationKey(location: ApiLocationLookupResponseObject): string {
	return `${location.lat},${location.lon}`;
}
</script>

<template>
	<div class="weather-widget__settings">
		<h3 class="weather-widget__settings-header">Settings</h3>

		<div v-if="weatherStore.locations.length === 0">
			<h3>No locations added yet.</h3>
			<p>
				Add a location by typing it in the text field below and pressing Enter.
			</p>
		</div>

		<Draggable
				v-model="weatherStore.locations"
				:item-key="getLocationKey"
				handle=".weather-widget__location-drag-button"
				class="weather-widget__settings-location-list"
				@change="weatherStore.saveLocationsToLocalStorage"
		>
			<template #item="{ element, index }">
				<LocationInSettings
					:location="element"
					@delete="deleteLocation(index)"
				/>
			</template>
		</Draggable>

		<div class="weather-widget__settings-input-container">
			<input
					v-model="newLocationName"
					:disabled="isLoading"
					@keyup.enter="addNewLocation"
			>
			<IconButton icon="subdirectory_arrow_left" @click="addNewLocation" />
		</div>

		<IconButton
				icon="close"
				class="weather-widget__close-settings-button"
				@click="closeSettings"
		/>
	</div>
</template>

<style scoped lang="scss">
.weather-widget {
	&__settings {
		display: flex;
		flex-direction: column;
		position: relative;
	}

	&__settings-header {
		margin: 12px 0;
	}

	&__close-settings-button {
		position: absolute;
		top: 6px;
		right: 6px;
	}

	&__settings-location-list {
		display: flex;
		flex-direction: column;
		gap: 12px;
		margin-bottom: 24px;
	}

	&__settings-input-container {
		display: grid;
		align-items: stretch;
		grid-template-columns: 1fr auto;
		gap: 4px;
	}
}
</style>
