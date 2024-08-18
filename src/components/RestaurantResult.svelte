<script lang="ts">
    import { getModalStore } from '@skeletonlabs/skeleton';
    const modalStore = getModalStore();

    // On utilise `meta` pour obtenir les données passées
    let name = '';
    let address = '';
    let rating = 0;
    let site = '';

    // On obtient les données de `meta` du premier modal actif
    $: {
        if ($modalStore.length > 0) {
            const { name: modalName, address: modalAddress, rating: modalRating } = $modalStore[0].meta;
            name = modalName || '';
            address = modalAddress || '';
            rating = modalRating || 0;
        }
    }

    function closeModal() {
        modalStore.close();
    }
</script>

<div class="p-6 max-w-sm mx-auto bg-slate-800 rounded-xl shadow-md space-y-4 relative">
    <button
            type="button"
            class="absolute top-2 right-2 p-1 text-white hover:text-gray-300"
            on:click={closeModal}
    >
        <svg xmlns="http://www.w3.org/2000/svg" class="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12" />
        </svg>
    </button>

    <h2 class="text-xl font-semibold">Restaurant trouvé</h2>
    <p><strong>👨‍🍳 Restaurant :</strong> {name}</p>
    <p><strong>📍 Adresse :</strong> {address}</p>
    <p><strong>⭐️ Note :</strong> {rating}/5</p>
</div>
