import { Client, client } from './client';

export class Base {
  protected readonly client: Client;

  constructor() {
    this.client = client;
  }
}
