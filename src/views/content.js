import { state } from '../state.js';
import { LINKS } from '../config.js';
import { shell, loadingBlock, errorBlock, backHeader } from './common.js';
import { feedNames } from '../providers/news.js';
import { fmt, escapeHtml } from '../utils/format.js';
export function newsView() {
  const tabs = feedNames().map(n=>`<button class="chip ${state.newsCategory===n?'active':''}" data-news-category="${n}">${n}</button>`).join('');
  if (state.loading) return shell(backHeader('Haber') + `<div class="chips">${tabs}</div>` + loadingBlock());
  let body;
  if (state.message && !state.news) body = errorBlock(state.message, '') + `<a class="secondary wide link-button" target="_blank" rel="noopener noreferrer" href="${LINKS.trtRssInfo}">TRT Haber'i aç</a>`;
  else if (!state.news) body = `<button class="primary wide" data-action="load-news">Son haberleri getir</button>`;
  else body = `<section class="list">${state.news.map(n=>`<a class="list-row news" target="_blank" rel="noopener noreferrer" href="${n.link}"><div><h3>${escapeHtml(n.title)}</h3><p>${n.date?fmt.dateTime(n.date):''}</p></div><span>↗</span></a>`).join('')}</section>`;
  return shell(backHeader('Haber','Başlık + kaynak bağlantısı') + `<div class="chips">${tabs}</div>${body}`);
}

export function marketsView() {
  if (state.loading) return shell(backHeader('Piyasalar') + loadingBlock());
  const rateRows = state.rates?.map(r=>`<div class="market-row"><b>${r.code}/TRY</b><span>Alış ${fmt.number(r.buy,4)}</span><strong>${fmt.number(r.sell,4)}</strong></div>`).join('') || '';
  return shell(backHeader('Piyasalar','Gerçek zamanlı BIST iddiası yok') + (state.message && !state.rates ? errorBlock(state.message,'') : '') + `<section class="market-card"><div class="market-title"><span>TCMB gösterge kurları</span><small>Son yayımlanan</small></div>${rateRows || '<p>Kur bilgisi henüz yüklenmedi.</p>'}</section><button class="primary wide" data-action="load-markets">TCMB kurlarını getir</button><a class="secondary wide link-button" target="_blank" rel="noopener noreferrer" href="${LINKS.bist}">Borsa İstanbul verilerini aç</a>`);
}

export function radioView() {
  if (state.loading) return shell(backHeader('Radyo') + loadingBlock('İstasyonlar aranıyor…'));
  if (state.message && !state.radios) return shell(backHeader('Radyo') + errorBlock(state.message));
  if (!state.radios) return shell(backHeader('Radyo','Radio Browser açık dizini') + `<button class="primary wide" data-action="load-radio">Türkiye radyolarını getir</button>`);
  return shell(backHeader('Radyo', `${state.radios.length} HTTPS istasyon`) + `<section class="list">${state.radios.slice(0,40).map(r=>`<button class="list-row radio-row" data-radio-id="${r.id}"><div>${r.favicon?`<img src="${escapeHtml(r.favicon)}" alt="" onerror="this.remove()">`:''}<span><h3>${escapeHtml(r.name)}</h3><p>${r.bitrate?`${r.bitrate} kbps · `:''}${escapeHtml(r.tags.split(',').slice(0,2).join(', '))}</p></span></div><span>${state.radioPlaying===r.id?'■':'▶'}</span></button>`).join('')}</section><audio id="radio-audio" preload="none"></audio>`);
}
