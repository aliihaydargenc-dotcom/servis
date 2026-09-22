export function haversineKm(a, b) {
  const toRad = (v) => (v * Math.PI) / 180;
  const R = 6371;
  const dLat = toRad(b.latitude - a.latitude);
  const dLon = toRad(b.longitude - a.longitude);
  const lat1 = toRad(a.latitude);
  const lat2 = toRad(b.latitude);
  const h = Math.sin(dLat / 2) ** 2 + Math.cos(lat1) * Math.cos(lat2) * Math.sin(dLon / 2) ** 2;
  return 2 * R * Math.asin(Math.sqrt(h));
}

export function boundingBox(point, radiusKm = 8) {
  const latDelta = radiusKm / 111;
  const lonDelta = radiusKm / (111 * Math.cos((point.latitude * Math.PI) / 180));
  return {
    west: point.longitude - lonDelta,
    south: point.latitude - latDelta,
    east: point.longitude + lonDelta,
    north: point.latitude + latDelta
  };
}

export function mapUrl(latitude, longitude) {
  const q = encodeURIComponent(`${latitude},${longitude}`);
  return `https://www.google.com/maps/search/?api=1&query=${q}`;
}
