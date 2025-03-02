import createClient, { Middleware } from 'openapi-fetch';
import { paths } from 'schema';
import { API_URL } from '../utils/constants';

const token = process.env.API_TOKEN;
if (!token) {
  throw new Error('token is missing');
}

const myMiddleware: Middleware = {
  async onRequest({ request }) {
    request.headers.set('content-type', 'application/json');
    request.headers.set('Authorization', `Bearer ${token}`);
    return request;
  },
};

export const client = createClient<paths>({ baseUrl: API_URL });
export type Client = typeof client;
client.use(myMiddleware);
