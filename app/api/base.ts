import { Client, client } from './client';

export abstract class Base {
  protected readonly client: Client;

  constructor() {
    this.client = client;
  }
}
