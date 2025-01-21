import { createCookieSessionStorage } from '@vercel/remix';

const sessionSecret = process.env.SESSION_SECRET ?? 'DEFAULT_SECRET';

export type Theme = 'light' | 'dark';
export type Lang = 'en' | 'ru';

export function isTheme(value: unknown): value is Theme {
  return value === 'light' || value === 'dark';
}

export function isLang(value: unknown): value is Lang {
  return value === 'en' || value === 'ru';
}

const prefsStorage = createCookieSessionStorage({
  cookie: {
    name: 'user-prefs',
    secure: process.env.NODE_ENV == 'production' ? true : false,
    secrets: [sessionSecret],
    sameSite: 'lax',
    path: '/',
    httpOnly: true,
    maxAge: 60 * 60 * 24 * 30,
  },
});

async function getPrefsSession(request: Request) {
  const session = await prefsStorage.getSession(request.headers.get('Cookie'));
  return {
    getPrefs: () => {
      const themeValue = session.get('theme');
      const theme = isTheme(themeValue) ? themeValue : 'light';

      const langValue = session.get('lang');
      const lang = isLang(langValue) ? langValue : 'en';
      return { theme, lang };
    },
    setPrefs: (theme: Theme, lang: Lang) => {
      session.set('theme', theme);
      session.set('lang', lang);
    },
    setTheme: (theme: Theme) => {
      session.set('theme', theme);
    },
    setLang: (lang: Lang) => {
      session.set('lang', lang);
    },
    commit: () => prefsStorage.commitSession(session),
  };
}

export { getPrefsSession };
