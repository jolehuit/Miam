import type { RequestHandler } from "@sveltejs/kit";
import { MAPS_API } from "$env/static/private";

export const POST: RequestHandler = async ({ request }) => {
    try {
        // Récupération des données de la requête
        const postData = await request.json();
        const { latitude, longitude, radius, minimalRate } = postData;

        // Construction de la requête fetch vers l'API externe
        const response = await fetch('https://places.googleapis.com/v1/places:searchNearby', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'X-Goog-Api-Key': MAPS_API,
                'X-Goog-FieldMask': 'places.displayName,places.formattedAddress,places.rating'
            },
            body: JSON.stringify({
                includedTypes: ["restaurant"],
                maxResultCount: 20,
                locationRestriction: {
                    circle: {
                        center: {
                            latitude: latitude,
                            longitude: longitude
                        },
                        radius: radius
                    }
                }
            })
        });

        const responseData = await response.json();
console.log(responseData)
        // Filtrer les restaurants ayant une note supérieure à minimalRate
        const filteredPlaces = responseData.places.filter((place: any) => place.rating >= minimalRate);

        // Si aucun restaurant ne correspond, renvoyer une réponse appropriée
        if (filteredPlaces.length === 0) {
            return new Response(JSON.stringify({ message: "Aucun restaurant trouvé avec une note supérieure à " + minimalRate }), { status: 404 });
        }

        // Sélectionner un restaurant aléatoire parmi les résultats filtrés
        const randomPlace = filteredPlaces[Math.floor(Math.random() * filteredPlaces.length)];
console.log(randomPlace.displayName)
        // Renvoyer les détails du restaurant sélectionné
        return new Response(JSON.stringify(randomPlace), { status: 200 });

    } catch (error) {
        console.error(error);
        // Gestion des erreurs générales
        return new Response(JSON.stringify({
            error: error.message
        }), { status: 500 });
    }
};
