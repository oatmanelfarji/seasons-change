/**
 * Detects the hemisphere of a country based on its latitude.
 *
 * @param latitude - The latitude of the country as a string or number.
 * @returns 'northern', 'southern', or 'equator'.
 */
export function getHemisphere(
	latitude: string | number,
): "northern" | "southern" | "equator" {
	const lat = typeof latitude === "string" ? parseFloat(latitude) : latitude;

	if (Number.isNaN(lat)) {
		throw new Error("Invalid latitude provided");
	}

	if (lat > 0) return "northern";
	if (lat < 0) return "southern";
	return "equator";
}
