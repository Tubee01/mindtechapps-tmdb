
import { Injectable, OnModuleDestroy } from '@nestjs/common';
import { Pool, PoolClient } from 'pg';

@Injectable()
export class PoolManager implements OnModuleDestroy {
  private clients: { [key: string]: PoolClient } = {};

  // get a connection pool from all this.clients
  GetClient(name) {
    if (this.clients[name]) return this.clients[name];
    else return null;
  }
  // create a new connection client
  async CreatePool(config) {
    if (this.GetClient(config.database)) throw new Error('Pool already exists');
    this.clients[config.database] = await new Pool(config).connect();
    return this.clients[config.database];
  }
  // if client already exists, return it, otherwise create it

  GetCreateIfNotExistClient(config) {
    let client = this.GetClient(config.database);
    if (client) return client;
    else return this.CreatePool(config);
  }

  async onModuleDestroy() {
    await Promise.all(
      Object.values(this.clients).map((client) => client.release())
    );
  }
}