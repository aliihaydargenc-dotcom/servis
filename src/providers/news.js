const FEEDS = {
  'Son Dakika': 'https://www.trthaber.com/sondakika_articles.rss',
  Türkiye: 'https://www.trthaber.com/turkiye_articles.rss',
  Dünya: 'https://www.trthaber.com/dunya_articles.rss',
  Ekonomi: 'https://www.trthaber.com/ekonomi_articles.rss',
  Teknoloji: 'https://www.trthaber.com/bilim_teknoloji_articles.rss',
  Spor: 'https://www.trthaber.com/spor_articles.rss'
};

export function feedNames() { return Object.keys(FEEDS); }

export async function getNews(category = 'Son Dakika') {
  const res = await fetch(FEEDS[category] || FEEDS['Son Dakika'], { headers: { Accept: 'application/rss+xml, text/xml' } });
  if (!res.ok) throw new Error(`Haber kaynağı ${res.status}`);
  const xml = await res.text();
  const doc = new DOMParser().parseFromString(xml, 'text/xml');
  if (doc.querySelector('parsererror')) throw new Error('RSS ayrıştırılamadı.');
  return [...doc.querySelectorAll('item')].slice(0, 25).map((item) => ({
    title: item.querySelector('title')?.textContent?.trim() || 'Başlık yok',
    link: item.querySelector('link')?.textContent?.trim() || '#',
    date: item.querySelector('pubDate')?.textContent || ''
  }));
}
