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
 * Created on 12/4/24 :: 1:52PM BY joyider <andre(-at-)sess.se>
 *
 * This file :: folderModel.ts is part of the fileTrekker project.
 */

import {Db, ObjectId} from 'mongodb';

export interface IFolder {
    _id?: ObjectId; // MongoDB ID
    name: string;
    parent?: ObjectId | null;
    owner: ObjectId;
    sharedWith?: ObjectId[];
    group?: ObjectId | null;
    createdAt?: Date;
    updatedAt?: Date;
}

export class FolderModel {
    private collection;

    constructor(private db: Db) {
        this.collection = db.collection('folders');
    }

    async createFolder(folder: {
        name: string;
        parent: ObjectId | null;
        owner: ObjectId;
        sharedWith?: ObjectId[];
        group?: ObjectId | null;
    }): Promise<ObjectId> {
        const result = await this.collection.insertOne({
            ...folder,
            createdAt: new Date(),
            updatedAt: new Date(),
        });
        return result.insertedId;
    }

    async listFolders(ownerId: ObjectId): Promise<any[]> {
        return this.collection.find({owner: ownerId}).toArray();
    }

    async updateFolder(folderId: ObjectId, updates: Partial<IFolder>): Promise<boolean> {
        const result = await this.collection.updateOne(
            {_id: folderId},
            {$set: {...updates, updatedAt: new Date()}}
        );
        return result.matchedCount > 0;
    }

    async deleteFolder(folderId: ObjectId, recursive: boolean = false): Promise<number> {
        const folderCollection = this.collection;

        if (!recursive) {
            const subfolders = await folderCollection.find({parent: folderId}).toArray();
            if (subfolders.length > 0) {
                throw new Error(
                    `Folder with ID ${folderId} cannot be deleted because it contains subfolders. Use the recursive option to delete all subfolders.`
                );
            }

            const result = await folderCollection.deleteOne({_id: folderId});

            if (result.deletedCount === 0) {
                throw new Error(`Folder with ID ${folderId} was not found.`);
            }

            console.log(`Folder with ID ${folderId} deleted successfully.`);
            return result.deletedCount;
        } else {
            const allFolders = await folderCollection.aggregate([
                {$match: {_id: folderId}},
                {
                    $graphLookup: {
                        from: "folders",
                        startWith: "$_id",
                        connectFromField: "_id",
                        connectToField: "parent",
                        as: "descendants",
                    },
                },
            ]).toArray();

            if (!allFolders.length) {
                throw new Error(`Folder with ID ${folderId} was not found.`);
            }

            const idsToDelete = allFolders[0].descendants.map((folder: { _id: ObjectId }) => folder._id);
            idsToDelete.push(folderId);

            const result = await folderCollection.deleteMany({_id: {$in: idsToDelete}});
            console.log(`Folder with ID ${folderId} and its ${result.deletedCount - 1} subfolders deleted successfully.`);
            return result.deletedCount;
        }
    }


}
