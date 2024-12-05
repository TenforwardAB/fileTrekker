/**
 * This file is licensed under the European Union Public License (EUPL) v1.2.
 * You may only use this work in compliance with the License.
 * You may obtain a copy of the License at:
 *
 * https://joinup.ec.europa.eu/collection/eupl/eupl-text-eupl-12
 *
 * Unless required by applicable law or agreed to in writing,
 * software distributed under the License is distributed "as is",
 * without any warranty or conditions of any kind.
 *
 * Copyright (c) 2024- Tenforward AB. All rights reserved.
 *
 * Created on 12/4/24 :: 1:44PM BY joyider <andre(-at-)sess.se>
 *
 * This file :: database.ts is part of the fileTrekker.
 */
import { MongoClient, Db } from 'mongodb';

const uri = process.env.MONGO_URI || 'mongodb://localhost:27017/subspace';
const dbName = process.env.MONGO_INITDB_DATABASE || 'subspace';

let client: MongoClient;
let db: Db;

export async function initializeDatabase(): Promise<Db> {
  if (!client || !db) {
    client = new MongoClient(uri, {
      auth: {
            username: process.env.APP_DB_USER,
            password: process.env.APP_DB_PASSWORD,
          },
    });
    await client.connect();
    db = client.db(dbName);
    console.log(`Connected to MongoDB database: ${dbName}`);
  }
  return db;
}

export { db };