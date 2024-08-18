<script lang="ts">
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

	const foodOptions: AutocompleteOption<string>[] = [
		{ label: 'Africain', value: 'Africain' },
		{ label: 'Argentin', value: 'Argentin' },
		{ label: 'Chinois', value: 'Chinois' },
		{ label: 'Coréen', value: 'Coréen' },
		{ label: 'Français', value: 'Français' },
		{ label: 'Indien', value: 'Indien' },
		{ label: 'Italien', value: 'Italien' },
		{ label: 'Japonais', value: 'Japonais' },
		{ label: 'Mexicain', value: 'Mexicain' },
		{ label: 'Péruvien', value: 'Péruvien' },
	];

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

			if (response.ok) {
				const data = await response.json();
		//		console.log('Données du restaurant:', data); // Ajoutez ce log pour vérifier les données
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
				const errorText = await response.text();
				console.error('Erreur lors de la recherche des restaurants:', errorText);
				toastStore.trigger({
					message: "Aucun restaurant trouvé.",
					type: 'error',
					duration: 5000,
				});
			}
		} catch (error) {
			console.error('Erreur lors de l\'envoi de la requête:', error);
			if (loc) {
				toastStore.trigger({
					message: "Une erreur est survenue lors de la recherche du restaurant.",
					type: 'error',
					duration: 5000,
				});
			}
		}
	}
</script>
<svelte:head>
	<title>Miam! - Trouver un restaurant</title>
	<meta name="description" content="Trouvez rapidement un restaurant bien noté près de chez vous, selon votre type de cuisine préféré et la note des utilisateurs.">
</svelte:head>
<div class="flex mt-1 items-center justify-center p-3">
	<div class="bg-gradient-to-r from-red-500 to-orange-600 text-white rounded-xl shadow-lg p-6 lg:p-8 space-y-6 w-full max-w-2xl">
		<h1 class="text-center text-2xl">👋 Hello, je vais t'aider à trouver un restaurant !</h1>
		<div class="text-center">
			<h2 class="text-xl lg:text-2xl font-medium">Où es-tu ?</h2>
			<button
					type="button"
					class=" mt-4 btn bg-white text-orange-600 font-bold py-2 px-4 lg:py-2 lg:px-6 rounded-full transition-transform duration-200 hover:scale-105 disabled:opacity-50 disabled:cursor-not-allowed"
					disabled={locationFound}
					on:click={getCurrentPosition}
			>
				{locationFound ? 'Localisation trouvée' : '📍 Donner ma localisation'}
			</button>
		</div>
		<h2 class="text-xl lg:text-2xl font-medium">🚶‍Une distance maximale ?</h2>

		<RangeSlider name="range-slider" bind:value={radius} max={maxRadius} step={1} class="w-full">
			<div class="flex justify-between items-center">
				<div class="font-bold text-lg">Distance maximale</div>
				<div class="text-lg lg:text-lg">{formatDistance(radius)}</div>
			</div>
		</RangeSlider>

		<h2 class="text-xl lg:text-2xl font-medium">⭐️ Une note minimale ?</h2>

		<RangeSlider name="range-slider" bind:value={minimalRate} max={maxRate} step={0.1} class="w-full">
			<div class="flex justify-between items-center">
				<div class="font-bold text-lg">Note minimale</div>
				<div class="text-lg lg:text-lg">{minimalRate} / {maxRate}</div>
			</div>
		</RangeSlider>

		<h2 class="text-xl lg:text-2xl font-medium">😋 Un type de nourriture spécifique ?</h2>
		<div class="flex items-center space-x-2">
			<input class="checkbox" type="checkbox" bind:checked={anyFoodType} id="anyFoodType" />
			<label for="anyFoodType">Peu importe</label>
		</div>

		{#if !anyFoodType}
			<select class="select" placeholder="Sélectionner une valeur" bind:value={foodType}>
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
	</div>
</div>
