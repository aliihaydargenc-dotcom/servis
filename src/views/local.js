import { state } from '../state.js';
import { shell, backHeader } from './common.js';
export function gamesView() {
  const tiles = state.board2048.map(v=>`<div class="tile v${v}">${v||''}</div>`).join('');
  return shell(backHeader('Kafa Dağıt','Offline 2048') + `<div class="game2048">${tiles}</div><div class="game-controls"><button data-game-move="up">↑</button><div><button data-game-move="left">←</button><button data-game-move="down">↓</button><button data-game-move="right">→</button></div></div><button class="secondary wide" data-action="new-2048">Yeni oyun</button>`);
}

export function toolsView() {
  return shell(backHeader('Araçlar','Tamamen cihazda') + `<section class="tool-card"><h3>Hızlı hesap</h3><div class="calc"><input id="calc-a" inputmode="decimal" placeholder="0"><select id="calc-op"><option>+</option><option>-</option><option>×</option><option>÷</option></select><input id="calc-b" inputmode="decimal" placeholder="0"><button data-action="calculate">=</button><output id="calc-result">—</output></div></section><section class="tool-card"><h3>Kronometre</h3><div class="stopwatch" id="stopwatch">${Math.floor(state.stopwatchElapsed/1000)} sn</div><div class="inline-actions"><button class="primary" data-action="stopwatch-toggle">${state.stopwatchStarted?'Durdur':'Başlat'}</button><button class="secondary" data-action="stopwatch-reset">Sıfırla</button></div></section>`);
}

export function settingsView() {
  return shell(backHeader('Ayarlar','Cihazda saklanır') + `<section class="settings-card"><label>TomTom ücretsiz API anahtarı<input id="tomtom-key" type="password" autocomplete="off" placeholder="Anahtarı buraya yapıştır"></label><p>GitHub reposuna veya uygulama koduna yazılmaz. Yalnız bu tarayıcının IndexedDB alanında tutulur.</p><button class="primary" data-action="save-tomtom">Kaydet</button></section><section class="settings-card"><h3>Konum</h3><p>Konum izni yalnız sen istediğinde çağrılır.</p><button class="secondary" data-action="locate">Konumumu güncelle</button></section><section class="settings-card"><h3>Kaynaklar</h3><p>Open-Meteo · TRT RSS · TCMB · Radio Browser · TomTom (opsiyonel) · Antalya Eczacı Odası bağlantısı</p></section>`);
}
