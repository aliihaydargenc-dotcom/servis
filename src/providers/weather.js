export async function getWeather(location) {
  const p = new URLSearchParams({
    latitude: location.latitude,
    longitude: location.longitude,
    current: 'temperature_2m,apparent_temperature,weather_code,wind_speed_10m',
    hourly: 'temperature_2m,precipitation_probability',
    daily: 'weather_code,temperature_2m_max,temperature_2m_min,precipitation_probability_max',
    timezone: 'Europe/Istanbul',
    forecast_days: '5'
  });
  const res = await fetch(`https://api.open-meteo.com/v1/forecast?${p}`);
  if (!res.ok) throw new Error(`Hava servisi ${res.status}`);
  return res.json();
}

export function weatherLabel(code) {
  if (code === 0) return 'Açık';
  if ([1,2].includes(code)) return 'Az bulutlu';
  if (code === 3) return 'Bulutlu';
  if ([45,48].includes(code)) return 'Sisli';
  if ([51,53,55,56,57].includes(code)) return 'Çiseleme';
  if ([61,63,65,66,67,80,81,82].includes(code)) return 'Yağmurlu';
  if ([71,73,75,77,85,86].includes(code)) return 'Karlı';
  if ([95,96,99].includes(code)) return 'Gök gürültülü';
  return 'Değişken';
}
