import { state } from '../state.js';
import { shell, loadingBlock, errorBlock, backHeader } from './common.js';
import { weatherLabel } from '../providers/weather.js';
import { pharmacyFallback } from '../providers/pharmacy.js';
import { fmt, escapeHtml } from '../utils/format.js';
import { mapUrl } from '../utils/geo.js';
export function weatherView() {
  if (state.loading) return shell(backHeader('Hava') + loadingBlock());
  if (state.message && !state.weather) return shell(backHeader('Hava') + errorBlock(state.message));
  const w = state.weather;
  if (!w) return shell(backHeader('Hava') + `<button class="primary wide" data-action="load-weather">Havayı getir</button>`);
  const days = w.daily.time.map((d,i)=>`<div class="day"><b>${new Intl.DateTimeFormat('tr-TR',{weekday:'short'}).format(new Date(d))}</b><span>${weatherLabel(w.daily.weather_code[i])}</span><strong>${Math.round(w.daily.temperature_2m_max[i])}°</strong><small>${Math.round(w.daily.temperature_2m_min[i])}° · yağış %${w.daily.precipitation_probability_max[i] ?? 0}</small></div>`).join('');
  return shell(backHeader('Hava', escapeHtml(state.location.name)) + `<section class="weather-now"><div><span>${weatherLabel(w.current.weather_code)}</span><strong>${Math.round(w.current.temperature_2m)}°</strong></div><div class="metric-list"><span>Hissedilen <b>${Math.round(w.current.apparent_temperature)}°</b></span><span>Rüzgar <b>${Math.round(w.current.wind_speed_10m)} km/sa</b></span></div></section><section class="days">${days}</section><button class="secondary wide" data-action="load-weather">Güncelle</button>`);
}

export function trafficView() {
  if (state.loading) return shell(backHeader('Trafik', 'Yakın çevrem') + loadingBlock('Canlı trafik olayları alınıyor…'));
  if (state.message && !state.traffic) return shell(backHeader('Trafik') + errorBlock(state.message) + `<button class="secondary wide" data-route="settings">TomTom anahtarını ayarla</button>`);
  if (!state.traffic) return shell(backHeader('Trafik','TomTom ücretsiz katmanı') + `<div class="notice"><b>Canlı trafik isteğe bağlıdır.</b><p>Ücretsiz TomTom anahtarını Ayarlar'a bir kez gir. Anahtar GitHub'a yazılmaz; yalnız bu cihazda saklanır.</p></div><button class="primary wide" data-action="load-traffic">Yakınımdaki olayları getir</button>`);
  const rows = state.traffic.length ? state.traffic.slice(0,30).map((x)=>`<article class="list-row"><div><span class="tag">${escapeHtml(x.category)}</span><h3>${escapeHtml(x.description)}</h3><p>${x.distanceKm!=null?`${fmt.number(x.distanceKm)} km · `:''}${x.delaySeconds?`${Math.round(x.delaySeconds/60)} dk gecikme`:'gecikme bilgisi yok'}</p></div>${x.position?`<a class="row-action" target="_blank" rel="noopener noreferrer" href="${mapUrl(x.position.latitude,x.position.longitude)}">Harita</a>`:''}</article>`).join('') : `<div class="center-state"><p>Yakın çevrede bildirilen aktif olay bulunamadı.</p></div>`;
  return shell(backHeader('Trafik', `${state.traffic.length} aktif olay`) + `<button class="secondary wide" data-action="load-traffic">Yenile</button><section class="list">${rows}</section>`);
}

export function pharmacyView() {
  const p = pharmacyFallback();
  return shell(backHeader('Nöbetçi Eczane','Antalya') + `<div class="notice warn"><b>Resmî veri entegrasyonu bekliyor.</b><p>${escapeHtml(p.message)}</p></div><a class="primary wide link-button" target="_blank" rel="noopener noreferrer" href="${p.url}">Antalya Eczacı Odası'nı aç</a><div class="roadmap"><b>Sonraki adım</b><p>API erişimi alındığında kimlik bilgisi client'a gömülmeden güvenli köprü üzerinden en yakın eczaneler mesafeye göre sıralanacak.</p></div>`);
}
