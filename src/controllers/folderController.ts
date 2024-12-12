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
import {logger} from "../services/loggerService";
import {ObjectId} from 'mongodb';

export class FolderController {
    static async createFolder(req: Request, res: Response): Promise<void> {
        logger.debug('Entering createFolder method', {body: req.body});
        const folderModel = new FolderModel(db);

        const {name, parent, owner, permissions} = req.body;

        try {
            logger.debug('Creating folder with details', {name, parent, owner, permissions});

            const folderId = await folderModel.createFolder({
                name,
                parent: parent ? new ObjectId(parent) : null,
                owner: new ObjectId(owner),
            });

            logger.info('Folder created successfully', {folderId});
            res.status(201).send({folderId});
        } catch (err) {
            logger.error('Error while creating folder', {
                error: err instanceof Error ? err.message : String(err),
                stack: err instanceof Error ? err.stack : undefined,
            });
            res.status(500).send({
                message: 'An error occurred',
                error: err instanceof Error ? err.message : String(err),
            });
        }
    }

    static async listFolders(req: Request, res: Response): Promise<void> {
        logger.debug('Entering listFolders method', {params: req.params});
        const folderModel = new FolderModel(db);

        try {
            const ownerId = new ObjectId(req.params.ownerId);
            logger.debug('Listing folders for ownerId', {ownerId});

            const folders = await folderModel.listFolders(ownerId);

            if (!folders.length) {
                logger.info('No folders found for ownerId', {ownerId});
                res.status(404).json({message: 'No folders found for this owner.'});
                return;
            }

            logger.debug('Fetched folders', {folders});

            const folderMap: Record<string, any> = {};
            const tree: any[] = [];

            folders.forEach(folder => {
                folderMap[folder._id.toString()] = {...folder, subfolders: []};
            });

            folders.forEach(folder => {
                const parentId = folder.parent?.toString();
                if (parentId && folderMap[parentId]) {
                    folderMap[parentId].subfolders.push(folderMap[folder._id.toString()]);
                } else {
                    tree.push(folderMap[folder._id.toString()]);
                }
            });

            logger.debug('Constructed folder tree', {tree});

            res.status(200).json(tree);
        } catch (err) {
            logger.error('Error building folder tree', {
                error: err instanceof Error ? err.message : String(err),
                stack: err instanceof Error ? err.stack : undefined,
            });

            res.status(500).json({
                message: 'An error occurred while fetching folders.',
                error: err instanceof Error ? err.message : String(err),
            });
        }
    }

    static async updateFolder(req: Request, res: Response): Promise<void> {
        logger.debug('Entering updateFolder method', {params: req.params, body: req.body});
        const folderModel = new FolderModel(db);

        const folderId = new ObjectId(req.params.folderId);
        const updates = req.body;

        try {
            logger.debug('Updating folder', {folderId, updates});

            const updated = await folderModel.updateFolder(folderId, updates);
            if (updated) {
                logger.info('Folder updated successfully', {folderId});
                res.send({message: 'Folder updated successfully'});
            } else {
                logger.warn('Folder not found for update', {folderId});
                res.status(404).send({message: 'Folder not found'});
            }
        } catch (err) {
            logger.error('Error while updating folder', {
                error: err instanceof Error ? err.message : String(err),
                stack: err instanceof Error ? err.stack : undefined,
            });
            res.status(500).send({
                message: 'An error occurred',
                error: err instanceof Error ? err.message : String(err),
            });
        }
    }

    static async deleteFolder(req: Request, res: Response): Promise<void> {
        logger.debug('Entering deleteFolder method', {params: req.params, query: req.query});
        const folderModel = new FolderModel(db);

        const folderId = new ObjectId(req.params.folderId);
        const recursive = req.query.recursive === 'true';

        try {
            logger.debug('Deleting folder', {folderId, recursive});

            const deleted = await folderModel.deleteFolder(folderId, recursive);
            if (deleted) {
                logger.info('Folder deleted successfully', {folderId, recursive});
                res.send({message: 'Folder and its subfolders deleted successfully.'});
            } else {
                logger.warn('Folder not found for deletion', {folderId});
                res.status(404).send({message: 'Folder not found.'});
            }
        } catch (err) {
            logger.error('Error while deleting folder', {
                error: err instanceof Error ? err.message : String(err),
                stack: err instanceof Error ? err.stack : undefined,
            });
            res.status(500).send({
                message: 'An error occurred',
                error: err instanceof Error ? err.message : String(err),
            });
        }
    }
}