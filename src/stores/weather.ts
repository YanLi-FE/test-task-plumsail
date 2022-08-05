import {defineStore} from "pinia";

export interface ApiLocationLookupResponseObject {
	name: string;
	lat: number;
	lon: number;
	country: string;
}

export interface ApiWeatherResponseObject {
	coord: {
		lon: number;
		lat: number;
	};
	weather: {
		id: number;
		main: string;
		description: string;
		icon: string;
	}[];
	base: string;
	main: {
		temp: number;
		feels_like: number;
		temp_min: number;
		temp_max: number;
		pressure: number;
		humidity: number;
	};
	visibility: number;
	wind: {
		speed: number;
		deg: number;
		gust: number;
	};
	clouds: {
		all: number;
	};
	dt: number;
	sys: {
		type: number;
		id: number;
		country: string;
		sunrise: number;
		sunset: number;
	};
	timezone: number;
	id: number;
	name: string;
	cod: number;
}

interface WeatherStoreState {
	locations: ApiLocationLookupResponseObject[];
	weather: ApiWeatherResponseObject[];
}

const STORAGE_KEY = "__weather-widget";
const API_KEY = import.meta.env.VITE_APP_OPEN_WEATHER_API_KEY;
const BASE_URL_WEATHER = "https://api.openweathermap.org/data/2.5";
const BASE_URL_GEO = "https://api.openweathermap.org/geo/1.0";

function buildWeatherUrl(lat: number, lon: number): string {
	return `${BASE_URL_WEATHER}/weather?lat=${lat}&lon=${lon}&units=metric&appid=${API_KEY}`;
}

function buildReverseGeoUrl(lat: number, lon: number): string {
	return `${BASE_URL_GEO}/reverse?lat=${lat}&lon=${lon}&limit=1&appid=${API_KEY}`;
}

function buildDirectGeoUrl(city: string): string {
	return `${BASE_URL_GEO}/direct?q=${city}&limit=1&appid=${API_KEY}`;
}

export const useWeatherStore = defineStore('weather', {
	state: () => ({
		locations: [],
		weather: [],
	} as WeatherStoreState),
	actions: {
		async initOnPageLoad(): Promise<void> {
			const locationString = localStorage.getItem(STORAGE_KEY);
			if (locationString != null) {
				this.locations = JSON.parse(locationString ?? "[]");
				await this.fetchWeatherForAllLocations();
				return;
			}
			navigator.geolocation.getCurrentPosition(
					async position => {
						let city = { name: "My location", country: ""};
						try {
							const response = await fetch(buildReverseGeoUrl(position.coords.latitude, position.coords.longitude));
							const json = await response.json() as ApiLocationLookupResponseObject[];
							city = { name: json[0].name, country: json[0].country };
						} catch {}
						const location = {
							name: city.name,
							lat: position.coords.latitude,
							lon: position.coords.longitude,
							country: city.country,
						};
						this.locations.push(location);
						await this.fetchWeatherForAllLocations();
						this.saveLocationsToLocalStorage();
					}
			);
		},

		deleteLocation(index: number): void {
			if (this.weather.length === this.locations.length) {
				this.weather.splice(index, 1);
			}
			this.locations.splice(index, 1);
			this.saveLocationsToLocalStorage();
		},

		async addLocationByName(name: string): Promise<void> {
			const response = await fetch(buildDirectGeoUrl(name));
			const json = await response.json() as ApiLocationLookupResponseObject[];
			const newLocation = {
				name: json[0].name,
				lat: json[0].lat,
				lon: json[0].lon,
				country: json[0].country,
			};
			const alreadyExists = this.locations.some(l => l.lat === newLocation.lat && l.lon === newLocation.lon);
			if (alreadyExists) {
				return;
			}
			this.locations.push(newLocation);
			this.saveLocationsToLocalStorage();
			await this.fetchWeatherForLocationIndex(this.locations.length - 1);
		},

		async fetchWeatherForAllLocations(): Promise<void> {
			const promises = this.locations.map(location =>
					fetch(buildWeatherUrl(location.lat, location.lon))
							.then(v => v.json())
			) as Promise<ApiWeatherResponseObject>[];
			this.weather = await Promise.all(promises);
		},

		async fetchWeatherForLocationIndex(index: number): Promise<void> {
			const location = this.locations[index];
			const promise = await fetch(buildWeatherUrl(location.lat, location.lon));
			this.weather[index] = await promise.json();
		},

		saveLocationsToLocalStorage(): void {
			localStorage.setItem(STORAGE_KEY, JSON.stringify(this.locations));
		}
	},
});
