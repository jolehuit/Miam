import { M as MAPS_API } from "../../../../chunks/private.js";
const POST = async ({ request }) => {
  try {
    const postData = await request.json();
    const { latitude, longitude, radius, minimalRate } = postData;
    const response = await fetch("https://places.googleapis.com/v1/places:searchNearby", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "X-Goog-Api-Key": MAPS_API,
        "X-Goog-FieldMask": "places.displayName,places.formattedAddress,places.rating,places.websiteUri"
      },
      body: JSON.stringify({
        includedTypes: ["restaurant"],
        maxResultCount: 10,
        locationRestriction: {
          circle: {
            center: {
              latitude,
              longitude
            },
            radius
          }
        }
      })
    });
    const responseData = await response.json();
    console.log(responseData);
    const filteredPlaces = responseData.places.filter((place) => place.rating >= minimalRate);
    if (filteredPlaces.length === 0) {
      return new Response(JSON.stringify({ message: "Aucun restaurant trouvé avec une note supérieure à " + minimalRate }), { status: 404 });
    }
    const randomPlace = filteredPlaces[Math.floor(Math.random() * filteredPlaces.length)];
    console.log(randomPlace.displayName);
    return new Response(JSON.stringify(randomPlace), { status: 200 });
  } catch (error) {
    console.error(error);
    return new Response(JSON.stringify({
      error: error.message
    }), { status: 500 });
  }
};
export {
  POST
};
