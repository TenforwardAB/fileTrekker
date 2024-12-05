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
 * Created on 12/4/24 :: 1:50PM BY joyider <andre(-at-)sess.se>
 *
 * This file :: fileModel.ts is part of the fileTrekker project.
 */

import { Db, ObjectId } from 'mongodb';

export interface IFile {
  _id?: ObjectId; // MongoDB ID
  name: string;
  path: string;
  size: number;
  owner: ObjectId;
  sharedWith?: ObjectId[];
  group?: ObjectId | null;
  createdAt?: Date;
  updatedAt?: Date;
}

export class FileModel {
  private collection;

  constructor(private db: Db) {
    this.collection = db.collection('files');
  }

  async createFile(file: {
    name: string;
    path: string;
    size: number;
    owner: ObjectId;
    parent: ObjectId | null;
    sharedWith?: ObjectId[];
    group?: ObjectId | null;
  }): Promise<ObjectId> {
    const result = await this.collection.insertOne({
      ...file,
      createdAt: new Date(),
      updatedAt: new Date(),
    });
    return result.insertedId;
  }

  async listFiles(ownerId: ObjectId, parentId: ObjectId | null = null): Promise<any[]> {
    return this.collection.find({ owner: ownerId, parent: parentId }).toArray();
  }

  async updateFile(fileId: ObjectId, updates: Partial<IFile>): Promise<boolean> {
    const result = await this.collection.updateOne(
      { _id: fileId },
      { $set: { ...updates, updatedAt: new Date() } }
    );
    return result.matchedCount > 0;
  }

  async deleteFile(fileId: ObjectId): Promise<boolean> {
    const result = await this.collection.deleteOne({ _id: fileId });
    return result.deletedCount === 1;
  }
}
