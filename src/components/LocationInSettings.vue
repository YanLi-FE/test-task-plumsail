<script setup lang="ts">
import IconButton from "@/components/IconButton.vue";
import type {ApiLocationLookupResponseObject} from "@/stores/weather";
import {computed} from "vue";

const props = defineProps<{
	location: ApiLocationLookupResponseObject;
}>();

const emit = defineEmits<{
	(e: "delete"): void;
}>();

const fullName = computed(() => {
	if (!props.location.country) {
		return props.location.name;
	}
	return `${props.location.name}, ${props.location.country}`;
});

const deleteLocation = () => {
	emit("delete");
};
</script>

<template>
	<div class="weather-widget__location">
		<IconButton class="weather-widget__location-drag-button" icon="menu" />
		<span>{{ fullName }}</span>
		<IconButton icon="delete" @click="deleteLocation" />
	</div>
</template>

<style scoped lang="scss">
.weather-widget {
	&__location {
		background-color: #edebe9;
		display: grid;
		grid-template-columns: auto 1fr auto;
		align-items: center;
		gap: 4px;
		padding: 6px;
	}

	&__location-button {
		border: none;
		background: none;
		cursor: pointer;
	}

	&__location-drag-button {
		cursor: grab;

		&:active {
			cursor: grabbing;
		}
	}
}
</style>
