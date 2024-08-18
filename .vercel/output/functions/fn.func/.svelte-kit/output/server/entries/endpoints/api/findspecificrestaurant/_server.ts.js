import { M as MAPS_API } from "../../../../chunks/private.js";
const POST = async ({ request }) => {
  try {
    const postData = await request.json();
    const { latitude, longitude, radius, minimalRate, foodType } = postData;
    const textQuery = `restaurant ${foodType}`;
    console.log("Query : " + textQuery);
    const earthRadius = 6378137;
    const deltaLat = radius / earthRadius;
    const deltaLon = radius / (earthRadius * Math.cos(Math.PI * latitude / 180));
    let lowLat = latitude - deltaLat * 180 / Math.PI;
    let highLat = latitude + deltaLat * 180 / Math.PI;
    let lowLon = longitude - deltaLon * 180 / Math.PI;
    let highLon = longitude + deltaLon * 180 / Math.PI;
    if (lowLat < -90) lowLat = -90;
    if (highLat > 90) highLat = 90;
    if (lowLon < -180) lowLon = -180;
    if (highLon > 180) highLon = 180;
    if (lowLon > highLon) {
      lowLon = -180;
      highLon = 180;
    }
    if (lowLat > highLat) {
      throw new Error("La latitude basse est plus élevée que la latitude haute.");
    }
    const response = await fetch("https://places.googleapis.com/v1/places:searchText", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "X-Goog-Api-Key": MAPS_API,
        "X-Goog-FieldMask": "places.displayName,places.formattedAddress,places.rating"
      },
      body: JSON.stringify({
        textQuery,
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
    console.log(responseData);
    const filteredPlaces = responseData.places.filter((place) => place.rating >= minimalRate);
    if (filteredPlaces.length === 0) {
      return new Response(JSON.stringify({ message: "Aucun restaurant trouvé avec une note supérieure à " + minimalRate }), { status: 404 });
    }
    const firstPlace = filteredPlaces[0];
    return new Response(JSON.stringify(firstPlace), { status: 200 });
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
