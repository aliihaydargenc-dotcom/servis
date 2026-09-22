import { APP_VERSION } from '../config.js';
import { weatherLabel } from '../providers/weather.js';
import { escapeHtml } from '../utils/format.js';
import { state, cards } from '../state.js';
export function shell(content) {
  const date = new Intl.DateTimeFormat('tr-TR', { weekday:'long', day:'numeric', month:'long' }).format(new Date());
  return `<header class="topbar"><div><button class="brand" data-route="home">Şehir Asistanı</button><div class="subtle">${date} · ${escapeHtml(state.location.name)}</div></div><button class="icon-btn" data-route="settings" aria-label="Ayarlar">⚙</button></header>
    <main>${content}</main>
    <nav class="bottom-nav"><button data-route="home" class="${state.route==='home'?'active':''}">Ana Sayfa</button><button data-route="tools" class="${state.route==='tools'?'active':''}">Araçlar</button><button data-route="settings" class="${state.route==='settings'?'active':''}">Ayarlar</button></nav>`;
}

export function homeView() {
  const current = state.weather?.current;
  const weatherMini = current ? `${Math.round(current.temperature_2m)}° · ${weatherLabel(current.weather_code)}` : 'Hava bilgisini açınca güncellenir';
  return shell(`<section class="hero"><div><span class="eyebrow">İHTİYAÇ ANINDA</span><h1>Ne lazım?</h1><p>Bilgiyi yalnız ilgili kartı açtığında getirir.</p></div><div class="weather-pill">${escapeHtml(weatherMini)}</div></section>
    <section class="quick-grid">${cards.map(([r,t,s,i]) => `<button class="quick-card" data-route="${r}"><span class="card-icon">${i}</span><span><b>${t}</b><small>${s}</small></span></button>`).join('')}</section>
    <section class="status-strip"><span class="dot online"></span><span>Local-first · v${APP_VERSION}</span><button data-action="locate">Konumumu kullan</button></section>`);
}

export function loadingBlock(text='Yükleniyor…') { return `<div class="center-state"><div class="spinner"></div><p>${text}</p></div>`; }
export function errorBlock(message, action='Tekrar dene') { return `<div class="notice error"><b>Veri alınamadı</b><p>${escapeHtml(message)}</p>${action?`<button class="secondary" data-action="reload">${action}</button>`:''}</div>`; }
export function backHeader(title, meta='') { return `<div class="page-head"><button class="back" data-route="home">←</button><div><h2>${title}</h2>${meta?`<p>${meta}</p>`:''}</div></div>`; }
