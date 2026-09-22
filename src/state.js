import { DEFAULT_LOCATION } from './config.js';
import { newBoard } from './games/game2048.js';
export const state={route:'home',location:DEFAULT_LOCATION,loading:false,message:'',weather:null,traffic:null,news:null,newsCategory:'Son Dakika',radios:null,rates:null,radioPlaying:null,board2048:newBoard(),stopwatchStarted:null,stopwatchElapsed:0};
export const cards=[['traffic','Trafik','Canlı olaylar','↗'],['pharmacy','Nöbetçi Eczane','Resmî kaynak','+'],['weather','Hava','Şimdi ve 5 gün','°'],['news','Son Dakika','TRT RSS','N'],['markets','Piyasalar','TCMB ve BIST','₺'],['radio','Radyo','Türkiye istasyonları','▶'],['games','Kafa Dağıt','2048','#'],['tools','Araçlar','Hesap + kronometre','⌁']];
