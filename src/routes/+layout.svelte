	<script lang="ts">
		import '../app.postcss';
		import { AppShell, AppBar, getModalStore, Modal } from '@skeletonlabs/skeleton';
		import { computePosition, autoUpdate, offset, shift, flip, arrow } from '@floating-ui/dom';
		import { storePopup } from '@skeletonlabs/skeleton';
		storePopup.set({ computePosition, autoUpdate, offset, shift, flip, arrow });
		import { initializeStores, Toast } from '@skeletonlabs/skeleton';
		import RestaurantResult from '../components/RestaurantResult.svelte';

		initializeStores();
		const modalStore = getModalStore();
		const modalRegistry = {
			restaurantResult: { ref: RestaurantResult },
		};
	</script>

	<!-- App Shell -->
	<Toast />
	<Modal components={modalRegistry} />

	<AppShell>
		<svelte:fragment slot="header">
			<!-- App Bar -->
			<AppBar>
				<svelte:fragment slot="lead">
					<strong class="text-xl uppercase">Miam!</strong>
				</svelte:fragment>
				<svelte:fragment slot="trail">
					<a
							class="btn btn-sm variant-ghost-surface"
							href="https://www.google.com/"
							target="_blank"
							rel="noreferrer"
					>
						Suis-nous
					</a>
				</svelte:fragment>
			</AppBar>
		</svelte:fragment>
		<!-- Page Route Content -->
		<slot />
	</AppShell>
