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
 * Created on 12/5/24 :: 1:26PM BY joyider <andre(-at-)sess.se>
 *
 * This file :: folderController.ts is part of the fileTrekker project.
 */

import {Request, Response} from 'express';
import {db} from '../config/database';
import {FolderModel} from '../models/folderModel';
import {ObjectId} from 'mongodb';

export class FolderController {
    static async createFolder(req: Request, res: Response) {
        const folderModel = new FolderModel(db);

        const {name, parent, owner} = req.body;

        try {
            const folderId = await folderModel.createFolder({
                name,
                parent: parent ? new ObjectId(parent) : null,
                owner: new ObjectId(owner),
            });
            res.status(201).send({folderId});
        } catch (err) {
            if (err instanceof Error) {
                res.status(500).send({message: 'An error occurred', error: err.message});
            } else {
                res.status(500).send({message: 'An error occurred', error: String(err)});
            }
        }
    }

    static async listFolders(req: Request, res: Response): Promise<void> {
    const folderModel = new FolderModel(db);

    try {
        const ownerId = new ObjectId(req.params.ownerId);
        console.log('Owner ID:', ownerId);

        const folders = await folderModel.listFolders(ownerId);

        if (!folders.length) {
            res.status(404).json({ message: 'No folders found for this owner.' });
            return;
        }

        console.log('Fetched Folders:', JSON.stringify(folders, null, 2));

        const folderMap: Record<string, any> = {};
        const tree: any[] = [];

        folders.forEach(folder => {
            folderMap[folder._id.toString()] = { ...folder, subfolders: [] };
        });

        folders.forEach(folder => {
            const parentId = folder.parent?.toString();
            if (parentId && folderMap[parentId]) {
                folderMap[parentId].subfolders.push(folderMap[folder._id.toString()]);
            } else {
                tree.push(folderMap[folder._id.toString()]);
            }
        });

        console.log('Folder Tree:', JSON.stringify(tree, null, 2));

        res.status(200).json(tree);
    } catch (err) {
        console.error('Error building folder tree:', err);

        res.status(500).json({
            message: 'An error occurred while fetching folders.',
            error: err instanceof Error ? err.message : String(err),
        });
    }
}

    static async updateFolder(req: Request, res: Response) {
        const folderModel = new FolderModel(db);

        const folderId = new ObjectId(req.params.folderId);
        const updates = req.body;

        try {
            const updated = await folderModel.updateFolder(folderId, updates);
            if (updated) {
                res.send({message: 'Folder updated successfully'});
            } else {
                res.status(404).send({message: 'Folder not found'});
            }
        } catch (err) {
            if (err instanceof Error) {
                res.status(500).send({message: 'An error occurred', error: err.message});
            } else {
                res.status(500).send({message: 'An error occurred', error: String(err)});
            }
        }
    }

    static async deleteFolder(req: Request, res: Response) {
    const folderModel = new FolderModel(db);

    const folderId = new ObjectId(req.params.folderId);
    const recursive = req.query.recursive === 'true';

    try {
        const deleted = await folderModel.deleteFolder(folderId, recursive);
        if (deleted) {
            res.send({ message: 'Folder and its subfolders deleted successfully.' });
        } else {
            res.status(404).send({ message: 'Folder not found.' });
        }
    } catch (err) {
        if (err instanceof Error) {
            res.status(500).send({ message: 'An error occurred', error: err.message });
        } else {
            res.status(500).send({ message: 'An error occurred', error: String(err) });
        }
    }
}
}
