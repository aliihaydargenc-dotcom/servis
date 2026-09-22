import { DEFAULT_LOCATION } from './config.js';

export function requestLocation() {
  if (!navigator.geolocation) return Promise.resolve(DEFAULT_LOCATION);
  return new Promise((resolve) => {
    navigator.geolocation.getCurrentPosition(
      (pos) => resolve({ name: 'Konumum', latitude: pos.coords.latitude, longitude: pos.coords.longitude }),
      () => resolve(DEFAULT_LOCATION),
      { enableHighAccuracy: true, timeout: 8000, maximumAge: 60_000 }
    );
  });
}
