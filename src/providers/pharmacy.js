import { LINKS } from '../config.js';
export function pharmacyFallback() {
  return {
    mode: 'official-link',
    message: 'Antalya Eczacı Odası API erişimi kimlik bilgisi gerektiriyor. Anahtarlar tarayıcıya gömülmeden önce güvenli köprü kurulacak.',
    url: LINKS.pharmacyOfficial
  };
}
