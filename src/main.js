import { App } from './app.js';
const app = new App(document.querySelector('#app'));
app.start();
if ('serviceWorker' in navigator) window.addEventListener('load',()=>navigator.serviceWorker.register('./sw.js').catch(()=>{}));
