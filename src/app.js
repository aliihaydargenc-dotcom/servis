import { CACHE_TTL } from './config.js';
import { cached, getValue, setValue } from './storage/db.js';
import { requestLocation } from './location.js';
import { getWeather } from './providers/weather.js';
import { getTrafficIncidents } from './providers/traffic.js';
import { getNews } from './providers/news.js';
import { getTurkishRadios } from './providers/radio.js';
import { getTcbmRates } from './providers/markets.js';
import { newBoard, move } from './games/game2048.js';
import { fmt } from './utils/format.js';
import { state } from './state.js';
import { views } from './views/index.js';
export class App {
  constructor(root) { this.root = root; this.audio = null; this.tick = null; }
  async start() {
    const saved = await getValue('location'); if (saved) state.location = saved;
    this.render();
    try { const w = await cached(`weather:${state.location.latitude.toFixed(2)}:${state.location.longitude.toFixed(2)}`, CACHE_TTL.weather, ()=>getWeather(state.location)); state.weather = w.data; this.render(); } catch {}
  }
  render() {
    this.root.innerHTML = (views[state.route] || views.home)();
    this.bind();
  }
  bind() {
    this.root.querySelectorAll('[data-route]').forEach(el=>el.addEventListener('click',()=>{ state.route=el.dataset.route; state.message=''; this.render(); }));
    this.root.querySelectorAll('[data-action]').forEach(el=>el.addEventListener('click',()=>this.action(el.dataset.action)));
    this.root.querySelectorAll('[data-news-category]').forEach(el=>el.addEventListener('click',()=>{ state.newsCategory=el.dataset.newsCategory; state.news=null; state.message=''; this.loadNews(); }));
    this.root.querySelectorAll('[data-radio-id]').forEach(el=>el.addEventListener('click',()=>this.playRadio(el.dataset.radioId)));
    this.root.querySelectorAll('[data-game-move]').forEach(el=>el.addEventListener('click',()=>{ state.board2048=move(state.board2048,el.dataset.gameMove); this.render(); }));
  }
  async busy(fn) { state.loading=true; state.message=''; this.render(); try { await fn(); } catch(e) { state.message=e?.message || 'Bilinmeyen hata'; } finally { state.loading=false; this.render(); } }
  async action(name) {
    if (name==='reload') return this.reloadCurrent();
    if (name==='locate') { const loc=await requestLocation(); state.location=loc; await setValue('location',loc); this.render(); return; }
    if (name==='load-weather') return this.loadWeather();
    if (name==='load-traffic') return this.loadTraffic();
    if (name==='load-news') return this.loadNews();
    if (name==='load-markets') return this.loadMarkets();
    if (name==='load-radio') return this.loadRadio();
    if (name==='save-tomtom') { const v=this.root.querySelector('#tomtom-key')?.value?.trim(); if(v){await setValue('tomtomKey',v); state.message=''; alert('Anahtar yalnız bu cihazda kaydedildi.');} return; }
    if (name==='new-2048') { state.board2048=newBoard(); this.render(); return; }
    if (name==='calculate') { const a=Number(this.root.querySelector('#calc-a').value.replace(',','.')); const b=Number(this.root.querySelector('#calc-b').value.replace(',','.')); const op=this.root.querySelector('#calc-op').value; let r=NaN; if(op==='+')r=a+b; if(op==='-')r=a-b; if(op==='×')r=a*b; if(op==='÷')r=b===0?NaN:a/b; this.root.querySelector('#calc-result').textContent=Number.isFinite(r)?fmt.number(r,6):'Hata'; return; }
    if (name==='stopwatch-toggle') { if(state.stopwatchStarted){ state.stopwatchElapsed += Date.now()-state.stopwatchStarted; state.stopwatchStarted=null; clearInterval(this.tick); } else { state.stopwatchStarted=Date.now(); this.tick=setInterval(()=>this.render(),1000); } this.render(); return; }
    if (name==='stopwatch-reset') { state.stopwatchStarted=null; state.stopwatchElapsed=0; clearInterval(this.tick); this.render(); }
  }
  reloadCurrent(){ const map={weather:'load-weather',traffic:'load-traffic',news:'load-news',markets:'load-markets',radio:'load-radio'}; return map[state.route]?this.action(map[state.route]):this.render(); }
  loadWeather(){ return this.busy(async()=>{ const r=await cached(`weather:${state.location.latitude.toFixed(2)}:${state.location.longitude.toFixed(2)}`,0,()=>getWeather(state.location)); state.weather=r.data; }); }
  loadTraffic(){ return this.busy(async()=>{ const key=await getValue('tomtomKey',''); state.traffic=await getTrafficIncidents(state.location,key); }); }
  loadNews(){ return this.busy(async()=>{ const r=await cached(`news:${state.newsCategory}`,0,()=>getNews(state.newsCategory)); state.news=r.data; }); }
  loadMarkets(){ return this.busy(async()=>{ state.rates=await getTcbmRates(); }); }
  loadRadio(){ return this.busy(async()=>{ const r=await cached('radio:tr',CACHE_TTL.radio,getTurkishRadios); state.radios=r.data; }); }
  playRadio(id){ const station=state.radios?.find(r=>r.id===id); if(!station)return; let audio=document.querySelector('#radio-audio'); if(!audio){this.render(); audio=document.querySelector('#radio-audio');} if(state.radioPlaying===id){audio.pause();state.radioPlaying=null;this.render();return;} audio.src=station.url; audio.play().catch(()=>alert('Bu istasyon tarayıcıda oynatılamadı.')); state.radioPlaying=id; this.render(); setTimeout(()=>{const a=document.querySelector('#radio-audio'); if(a){a.src=station.url;a.play().catch(()=>{});}},0); }
}
