import { index, route, type RouteConfig } from '@react-router/dev/routes';

export default [
  index('routes/index.tsx'),
  route('movie/:id', './routes/movie.tsx'),
  route('tv/:id/season/:sId', './routes/tv.tsx'),
  route('/action/set-prefs', './routes/action.set-prefs.tsx'),
  route('/action/search', './routes/action.search.tsx'),
] satisfies RouteConfig;
