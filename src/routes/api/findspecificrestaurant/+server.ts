import type { RequestHandler } from "@sveltejs/kit";
import { MAPS_API } from "$env/static/private";

export const POST: RequestHandler = async ({ request }) => {
    try {
        // Récupération des données de la requête
        const postData = await request.json();
        const { latitude, longitude, radius, minimalRate, foodType } = postData;

        // Construction de la query textuelle avec le type de nourriture
        const textQuery = `restaurant ${foodType}`;
        console.log("Query : " + textQuery)
        // Rayon moyen de la Terre en mètres
        const earthRadius = 6378137;

        // Calcul des décalages en latitude et longitude
        const deltaLat = radius / earthRadius;
        const deltaLon = radius / (earthRadius * Math.cos(Math.PI * latitude / 180));

        // Calcul des coordonnées minimales et maximales
        let lowLat = latitude - (deltaLat * 180 / Math.PI);
        let highLat = latitude + (deltaLat * 180 / Math.PI);
        let lowLon = longitude - (deltaLon * 180 / Math.PI);
        let highLon = longitude + (deltaLon * 180 / Math.PI);

        // Validation et ajustement des limites pour ne pas sortir des bornes géographiques
        if (lowLat < -90) lowLat = -90;
        if (highLat > 90) highLat = 90;
        if (lowLon < -180) lowLon = -180;
        if (highLon > 180) highLon = 180;

        // Gestion des cas où la longitude traverse la ligne de changement de date
        if (lowLon > highLon) {
            lowLon = -180;
            highLon = 180;
        }

        // Gestion des cas où la latitude est inversée
        if (lowLat > highLat) {
            throw new Error("La latitude basse est plus élevée que la latitude haute.");
        }

        // Construction de la requête fetch vers l'API externe
        const response = await fetch('https://places.googleapis.com/v1/places:searchText', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'X-Goog-Api-Key': MAPS_API,
                'X-Goog-FieldMask': 'places.displayName,places.formattedAddress,places.rating'
            },
            body: JSON.stringify({
                textQuery: textQuery,
                locationRestriction: {
                    rectangle: {
                        low: {
                            latitude: lowLat,
                            longitude: lowLon
                        },
                        high: {
                            latitude: highLat,
                            longitude: highLon
                        }
                    }
                },
                pageSize: 10,
                openNow: true
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

        // Renvoyer les détails du premier restaurant trouvé
        const firstPlace = filteredPlaces[0];

        return new Response(JSON.stringify(firstPlace), { status: 200 });

    } catch (error) {
        console.error(error);
        // Gestion des erreurs générales
        return new Response(JSON.stringify({
            error: error.message
        }), { status: 500 });
    }
};
