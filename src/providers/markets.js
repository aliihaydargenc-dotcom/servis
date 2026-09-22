export async function getTcbmRates() {
  const res = await fetch('https://www.tcmb.gov.tr/kurlar/today.xml');
  if (!res.ok) throw new Error(`TCMB ${res.status}`);
  const xml = await res.text();
  const doc = new DOMParser().parseFromString(xml, 'text/xml');
  const pick = (code) => {
    const node = [...doc.querySelectorAll('Currency')].find((n) => n.getAttribute('CurrencyCode') === code);
    return node ? {
      code,
      buy: Number(node.querySelector('ForexBuying')?.textContent || 0),
      sell: Number(node.querySelector('ForexSelling')?.textContent || 0)
    } : null;
  };
  return [pick('USD'), pick('EUR'), pick('GBP')].filter(Boolean);
}
