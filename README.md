# Şehir Asistanı 2.0

Kişisel kullanım için mobil-first, local-first PWA. Amaç gün boyu açık kalmak değil; trafik, nöbetçi eczane, hava, haber, piyasa, radyo ve küçük araçlara ihtiyaç anında 1-2 dokunuşta ulaşmak.

## İlk sürümde çalışanlar
- Open-Meteo hava durumu ve 5 günlük görünüm
- TomTom anahtarı kullanıcı tarafından cihazda girildiğinde canlı trafik olay listesi
- TRT Haber RSS okuyucu (tarayıcı CORS izin verirse; aksi halde resmî kaynağa fallback)
- TCMB günlük gösterge kurları (CORS desteklenmezse resmî kaynağa fallback geliştirilecek)
- Radio Browser üzerinden HTTPS Türk radyo istasyonları
- Offline 2048
- Hesap makinesi ve kronometre
- IndexedDB tabanlı cihaz içi ayarlar/cache
- PWA manifest + service worker
- Antalya Eczacı Odası resmî sayfasına güvenli fallback

## Mimari ilkeler
- Ücretli API zorunluluğu yok.
- Sağlayıcılar UI'dan ayrıdır; trafik/hava/haber vb. provider modüllerinden gelir.
- Gizli anahtarlar repoya gömülmez. TomTom anahtarı kullanıcının cihazında saklanır.
- Canlı veri yalnız ilgili ekran açılınca çağrılır.
- Uygulama kabuğu ve offline araçlar bağlantı olmadan açılabilir.

## Geliştirme
```bash
npm test
npm run check
python3 -m http.server 4173
```

## Yayın
Statik dosyalar GitHub Pages üzerinde doğrudan çalışacak şekilde kök-relative değil, `./` yollarla hazırlanmıştır.
