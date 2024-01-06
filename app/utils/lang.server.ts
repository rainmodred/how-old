import * as cookie from 'cookie';

const cookieName = 'lang';
export type Lang = 'en' | 'ru';

export function getLang(request: Request): Lang {
  const cookieHeader = request.headers.get('cookie');
  const parsed = cookieHeader ? cookie.parse(cookieHeader)[cookieName] : 'en';
  if (parsed === 'en' || parsed === 'ru') return parsed;
  return 'en';
}

export function setLang(lang: Lang) {
  return cookie.serialize(cookieName, lang, { path: '/' });
}
