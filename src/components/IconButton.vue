<script setup lang="ts">
defineProps<{
	icon: string;
}>();
</script>

<template>
	<button class="weather-widget__icon-button">
		<i class="material-symbols-outlined">{{ icon }}</i>
	</button>
</template>

<style scoped lang="scss">
.weather-widget__icon-button {
	border: none;
	background: none;
	cursor: pointer;
	border-radius: 6px;
	padding: 6px;

	&:hover {
		background-color: #f5f5f5;
	}
}
</style>
