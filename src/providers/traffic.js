import { boundingBox, haversineKm } from '../utils/geo.js';

const CATEGORY = {
  0: 'Bilinmiyor', 1: 'Kaza', 2: 'Sis', 3: 'Tehlikeli koşul', 4: 'Yağmur', 5: 'Buzlanma',
  6: 'Yoğunluk', 7: 'Şerit kapalı', 8: 'Yol kapalı', 9: 'Yol çalışması', 10: 'Rüzgar',
  11: 'Sel', 14: 'Arızalı araç'
};

function normalizeFeature(feature, origin) {
  const p = feature.properties || {};
  const coords = feature.geometry?.coordinates;
  const point = Array.isArray(coords?.[0]) ? coords[0] : coords;
  const position = Array.isArray(point) ? { longitude: point[0], latitude: point[1] } : null;
  return {
    id: p.id || crypto.randomUUID(),
    category: CATEGORY[p.iconCategory] || 'Trafik olayı',
    description: p.events?.[0]?.description || p.from || p.to || 'Trafik olayı',
    delaySeconds: Number(p.delay || 0),
    magnitude: p.magnitudeOfDelay ?? 0,
    position,
    distanceKm: position ? haversineKm(origin, position) : null
  };
}

export async function getTrafficIncidents(location, apiKey, radiusKm = 8) {
  if (!apiKey) throw new Error('TomTom API anahtarı ayarlardan eklenmeli.');
  const b = boundingBox(location, radiusKm);
  const bbox = `${b.west},${b.south},${b.east},${b.north}`;
  const params = new URLSearchParams({
    key: apiKey,
    bbox,
    fields: '{incidents{type,geometry{type,coordinates},properties{id,iconCategory,magnitudeOfDelay,delay,from,to,events{description,code}}}}}',
    language: 'tr-TR',
    timeValidityFilter: 'present'
  });
  const res = await fetch(`https://api.tomtom.com/traffic/services/5/incidentDetails?${params}`);
  if (!res.ok) throw new Error(`Trafik servisi ${res.status}`);
  const json = await res.json();
  return (json.incidents || json.features || [])
    .map((f) => normalizeFeature(f, location))
    .sort((a, b2) => (a.distanceKm ?? 999) - (b2.distanceKm ?? 999));
}
