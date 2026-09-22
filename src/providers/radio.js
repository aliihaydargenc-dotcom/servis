const SERVERS = [
  'https://de1.api.radio-browser.info',
  'https://nl1.api.radio-browser.info',
  'https://at1.api.radio-browser.info'
];

export async function getTurkishRadios() {
  let lastError;
  for (const server of SERVERS) {
    try {
      const url = `${server}/json/stations/bycountrycodeexact/TR?hidebroken=true&order=clickcount&reverse=true&limit=80`;
      const res = await fetch(url);
      if (!res.ok) throw new Error(String(res.status));
      const stations = await res.json();
      return stations
        .filter((s) => (s.url_resolved || s.url)?.startsWith('https://'))
        .map((s) => ({
          id: s.stationuuid,
          name: s.name?.trim() || 'Radyo',
          url: s.url_resolved || s.url,
          favicon: s.favicon || '',
          bitrate: s.bitrate || 0,
          tags: s.tags || ''
        }));
    } catch (error) { lastError = error; }
  }
  throw lastError || new Error('Radyo listesi alınamadı.');
}
