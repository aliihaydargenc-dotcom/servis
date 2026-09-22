# Mimari

Şehir Asistanı 2.0 dependency-light bir PWA'dır. İlk sürümde build tool gerektirmez. Bunun nedeni kişisel kullanımda bakım yüzeyini ve dış bağımlılığı azaltmaktır.

## Katmanlar
1. `src/app.js`: ekran ve etkileşim orkestrasyonu.
2. `src/providers/*`: canlı veri adaptörleri.
3. `src/storage/db.js`: IndexedDB ve cache.
4. `src/utils/*`: saf yardımcılar.
5. `sw.js`: yalnız same-origin app shell cache'i.

Provider'lar değiştirilebilir olacak şekilde ayrı tutulur. Örneğin TomTom ücretsiz katmanı değişirse `traffic.js` değişir; trafik ekranı değişmez.
