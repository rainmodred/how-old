import { data } from 'react-router';
import { Lang, Theme, getPrefsSession } from '~/utils/userPrefs.server';
import { Route } from './+types/action.set-prefs';

export async function action({ request }: Route.ActionArgs) {
  const prefsSession = await getPrefsSession(request);
  const formData = await request.formData();

  const intent = formData.get('intent');

  const prevPrefs = prefsSession.getPrefs();

  let theme = formData.get('theme') as Theme;
  let lang = formData.get('lang') as Lang;

  if (intent === 'change-theme') {
    lang = prevPrefs.lang;
  } else if (intent === 'change-lang') {
    theme = prevPrefs.theme;
  }

  prefsSession.setPrefs(theme, lang);

  return data(
    { success: true },
    { headers: { 'Set-Cookie': await prefsSession.commit() } },
  );
}

// export async function loader() {
//   redirect('/', { status: 404 });
// }
