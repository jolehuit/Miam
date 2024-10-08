<script lang="ts">
	import { onMount } from 'svelte';
	import { Geolocation } from '@capacitor/geolocation';
	import {
		Autocomplete,
		type AutocompleteOption,
		RangeSlider,
		type ToastSettings
	} from "@skeletonlabs/skeleton";
	import { getToastStore, getModalStore } from '@skeletonlabs/skeleton';

	const modalStore = getModalStore();
	const toastStore = getToastStore();

	let loc: GeolocationPosition | null = null;
	let radius = 500;  // Valeur initiale du rayon en mètres
	let maxRadius = 50000;   // Valeur maximale possible du rayon
	let minimalRate = 4;
	let maxRate = 5;
	let locationFound = false; // Variable d'état pour suivre si la localisation a été trouvée
	let foodType = 'Français';
	let anyFoodType = false; // Variable d'état pour la case à cocher "Peu importe" et cochée par défaut

	let deferredPrompt: any;
	let showInstallButton = false;

	const foodOptions: AutocompleteOption<string>[] = [
		{ label: 'Africain', value: 'Africain' },
		{ label: 'Argentin', value: 'Argentin' },
		{ label: 'Casher', value: 'Casher' },
		{ label: 'Chinois', value: 'Chinois' },
		{ label: 'Coréen', value: 'Coréen' },
		{ label: 'Français', value: 'Français' },
		{ label: 'Halal', value: 'Halal' },
		{ label: 'Indien', value: 'Indien' },
		{ label: 'Italien', value: 'Italien' },
		{ label: 'Japonais', value: 'Japonais' },
		{ label: 'Mexicain', value: 'Mexicain' },
		{ label: 'Péruvien', value: 'Péruvien' },
		{ label: 'Vegan', value: 'Vegan' },
	];

	onMount(() => {
		window.addEventListener('beforeinstallprompt', (e) => {
			e.preventDefault();
			deferredPrompt = e;
			showInstallButton = true;
		});
	});

	async function addToHomeScreen() {
		if (deferredPrompt) {
			deferredPrompt.prompt();
			const { outcome } = await deferredPrompt.userChoice;
			if (outcome === 'accepted') {
				console.log('Utilisateur a accepté d\'ajouter à l\'écran d\'accueil');
			} else {
				console.log('Utilisateur a refusé d\'ajouter à l\'écran d\'accueil');
			}
			deferredPrompt = null;
			showInstallButton = false;
		}
	}

	async function getCurrentPosition() {
		try {
			const res = await Geolocation.getCurrentPosition();
			loc = res;
			locationFound = true; // Mise à jour de l'état lorsque la localisation est trouvée
		} catch (error) {
			console.error('Erreur lors de la récupération de la position:', error);
			toastStore.trigger({
				message: "Impossible d'obtenir la position actuelle.",
				type: 'error',
				duration: 5000,
			});
			locationFound = false; // Assurez-vous que l'état est réinitialisé en cas d'erreur
		}
	}

	function formatDistance(radius: number): string {
		if (radius >= 1000) {
			return `${(radius / 1000).toFixed(1)} kilomètres`;
		} else {
			return `${radius} mètres`;
		}
	}

	async function findRestaurant() {
		if (!loc) {
			toastStore.trigger({
				message: "Tu dois d'abord autoriser l'accès à ta position !",
				duration: 5000,
			});
			return;
		}

		// Validation si "Peu importe" n'est pas coché et foodType est vide
		if (!anyFoodType && !foodType) {
			toastStore.trigger({
				message: "Veuillez sélectionner un type de nourriture ou cochez 'Peu importe'.",
				type: 'error',
				duration: 5000,
			});
			return;
		}

		try {
			const apiUrl = anyFoodType ? '/api/findrestaurant' : '/api/findspecificrestaurant';
			const body = {
				latitude: loc.coords.latitude,
				longitude: loc.coords.longitude,
				radius: radius,
				minimalRate: minimalRate,
			};
			if (!anyFoodType) {
				body['foodType'] = foodType;
			}

			const response = await fetch(apiUrl, {
				method: 'POST',
				headers: {
					'Content-Type': 'application/json'
				},
				body: JSON.stringify(body)
			});

			// Si le code de statut n'est pas 200, affiche un message d'erreur
			if (!response.ok) {
				const errorText = await response.text();
				if (response.status === 404) {
					// Cas spécifique pour "aucun restaurant trouvé"
					if (minimalRate === maxRate) {
						toastStore.trigger({
							message: "Aucun restaurant trouvé. Tu as sélectionné 5/5 comme note minimale, essaye de sélectionner moins !",
							type: 'info',
							duration: 5000,
						});
					} else {
						toastStore.trigger({
							message: "Aucun restaurant trouvé.",
							type: 'info',
							duration: 5000,
						});
					}
				} else {
					console.error('Erreur lors de la recherche des restaurants:', errorText);
					toastStore.trigger({
						message: "Aucun restaurant trouvé.",
						type: 'error',
						duration: 5000,
					});
				}
				return;
			}

			// Réponse OK
			const data = await response.json();

			// Assure-toi que la réponse contient des données valides
			if (data && data.displayName && data.formattedAddress && data.rating) {
				modalStore.trigger({
					type: 'component',
					component: 'restaurantResult',
					meta: {
						name: data.displayName.text,
						address: data.formattedAddress,
						rating: data.rating,
					}
				});
			} else {
				// Si les données sont présentes mais incomplètes
				toastStore.trigger({
					message: "Aucun restaurant trouvé.",
					type: 'info',
					duration: 5000,
				});
			}
		} catch (error) {
			console.error('Erreur lors de l\'envoi de la requête:', error);
			toastStore.trigger({
				message: "Une erreur est survenue lors de la recherche du restaurant.",
				type: 'error',
				duration: 5000,
			});
		}
	}

</script>
<div class="flex flex-col mt-1 items-center justify-center p-3">
	<h1 class="text-center text-2xl w-full mb-5">⏱️ C'est parti pour trouver un restaurant en 30 secondes !</h1>
	<div class="bg-gradient-to-r from-red-500 to-orange-600 text-white rounded-xl shadow-lg p-3 lg:p-8 space-y-6 w-full max-w-2xl">
		<div class="">
			<h2 class="text-xl lg:text-xl">1. Je dois accéder à ta localisation. </h2>
			<button
					type="button"
					class=" mt-4 btn bg-white text-orange-600 font-medium py-2 px-4 lg:py-2 lg:px-6 rounded-full transition-transform duration-200 hover:scale-105 disabled:opacity-50 disabled:cursor-not-allowed"
					disabled={locationFound}
					on:click={getCurrentPosition}
			>
				{locationFound ? 'Localisation trouvée' : '📍 Donner ma localisation'}
			</button>
		</div>
		<h2 class="text-xl lg:text-xl font-medium">2. Une distance maximale ?</h2>

		<RangeSlider name="range-slider" bind:value={radius} max={maxRadius} step={1} class="w-full">
			<div class="flex justify-between items-center">
				<div class="font-medium text-lg">Distance maximale 🚶</div>
				<div class="text-lg lg:text-lg">{formatDistance(radius)}</div>
			</div>
		</RangeSlider>

		<h2 class="text-xl lg:text-xl font-medium">3. Une note minimale ?</h2>

		<RangeSlider name="range-slider" bind:value={minimalRate} max={maxRate} step={0.1} class="w-full">
			<div class="flex justify-between items-center">
				<div class="font-medium text-lg">Note minimale ⭐️</div>
				<div class="text-lg lg:text-lg">{minimalRate} / {maxRate}</div>
			</div>
		</RangeSlider>

		<h2 class="text-xl lg:text-xl font-medium">4. Un type de nourriture spécifique ?</h2>
		<div class="flex items-center space-x-2">
			<input class="checkbox" type="checkbox" bind:checked={anyFoodType} id="anyFoodType" />
			<label for="anyFoodType">Peu importe</label>
		</div>
		{#if !anyFoodType}
			<select class="select" bind:value={foodType}>
				{#each foodOptions as option}
					<option value={option.value}>{option.label}</option>
				{/each}
			</select>
		{/if}

		<div class="text-center">
			<button
					type="button"
					class="btn bg-white text-red-600 font-bold py-2 px-4 lg:py-2 lg:px-6 rounded-full transition-transform duration-200 hover:scale-105"
					on:click={findRestaurant}
			>
				🔎 Trouve moi un restaurant !
			</button>
		</div>
		<div class="text-center mt-4">
			{#if showInstallButton}
				<button
						type="button"
						class="btn bg-white text-blue-600 font-bold py-2 px-4 lg:py-2 lg:px-6 rounded-full transition-transform duration-200 hover:scale-105"
						on:click={addToHomeScreen}
				>
					📱 Ajouter à l'écran d'accueil
				</button>
			{/if}
		</div>
	</div>
</div>
