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
 * Created on 12/5/24 :: 1:27PM BY joyider <andre(-at-)sess.se>
 *
 * This file :: fileController.ts is part of the fileTrekker project.
 */

import {Request, Response} from 'express';
import {db} from '../config/database';
import {FileModel} from '../models/fileModel';
import {GridFSBucket, ObjectId} from 'mongodb';
import {logger} from "../services/loggerService";

export class FileController {
    static uploadFile = async (req: Request, res: Response): Promise<void> => {
        logger.debug('Entering uploadFile method', {body: req.body});
        const fileModel = new FileModel(db);
        const bucket = new GridFSBucket(db);
        const folderCollection = db.collection('folders');

        const {owner, parent, permissions} = req.body;
        const file = req.file;

        if (!file) {
            logger.warn('No file uploaded in request');
            res.status(400).send({message: 'No file uploaded'});
            return;
        }

        try {
            logger.debug('Preparing to upload file', {file: file.originalname, owner, parent, permissions});

            if (parent) {
                const parentFolder = await folderCollection.findOne({_id: new ObjectId(parent)});
                logger.debug('Parent folder lookup result', {parentFolder});

                if (!parentFolder) {
                    logger.warn(`Parent folder with ID ${parent} does not exist.`);
                    res.status(400).send({message: `Parent folder with ID ${parent} does not exist.`});
                    return;
                }

                if (parentFolder.groupFolderId || parentFolder.isGroupFolder) {
                    const hasWriteAccess = parentFolder.sharedWith?.some(
                        (entry: { id: string; permissions: string[] }) =>
                            entry.id === owner && entry.permissions.includes('write')
                    );

                    if (!hasWriteAccess) {
                        logger.error('Write access denied to parent folder', {owner, parent});
                        throw new Error('You do not have write access to this folder.');
                    }
                }
            }

            const uploadStream = bucket.openUploadStream(file.originalname, {
                metadata: {
                    owner: new ObjectId(owner),
                    parent: parent ? new ObjectId(parent) : null,
                },
            });

            uploadStream.end(file.buffer);

            uploadStream.on('finish', async () => {
                try {
                    const fileId = await fileModel.createFile({
                        name: file.originalname,
                        path: `/files/${uploadStream.id}`,
                        size: file.size,
                        owner: new ObjectId(owner),
                        parent: parent ? new ObjectId(parent) : null,
                    });
                    logger.info('File uploaded successfully', {fileId});
                    res.status(201).send({fileId});
                } catch (dbErr) {
                    logger.error('Error saving file metadata', {
                        error: dbErr instanceof Error ? dbErr.message : String(dbErr),
                        stack: dbErr instanceof Error ? dbErr.stack : undefined,
                    });
                    if (dbErr instanceof Error) {
                        res.status(500).send({message: 'Error saving file metadata', error: dbErr.message});
                    } else {
                        res.status(500).send({message: 'Error saving file metadata', error: String(dbErr)});
                    }
                }
            });

            uploadStream.on('error', (err) => {
                logger.error('Error during file upload stream', {error: err.message, stack: err.stack});
                res.status(500).send({message: 'File upload failed', error: err.message});
            });
        } catch (err) {
            logger.error('Error during file upload', {
                error: err instanceof Error ? err.message : String(err),
                stack: err instanceof Error ? err.stack : undefined,
            });
            if (err instanceof Error) {
                res.status(500).send({message: 'File upload failed', error: err.message});
            } else {
                res.status(500).send({message: 'File upload failed', error: String(err)});
            }
        }
    };

    static async listFiles(req: Request, res: Response): Promise<void> {
        logger.debug('Entering listFiles method', {params: req.params});
        const fileModel = new FileModel(db);

        try {
            const ownerId = new ObjectId(req.params.ownerId);
            logger.debug('Listing files for ownerId', {ownerId});

            const files = await fileModel.listFiles(ownerId);

            logger.info('Files retrieved successfully', {files});
            res.send(files);
        } catch (err) {
            logger.error('Failed to list files', {
                error: err instanceof Error ? err.message : String(err),
                stack: err instanceof Error ? err.stack : undefined,
            });
            if (err instanceof Error) {
                res.status(500).send({message: 'Failed to list files', error: err.message});
            } else {
                res.status(500).send({message: 'Failed to list files', error: String(err)});
            }
        }
    }

    static async updateFile(req: Request, res: Response): Promise<void> {
        logger.debug('Entering updateFile method', {params: req.params, body: req.body});
        const fileModel = new FileModel(db);

        const fileId = new ObjectId(req.params.fileId);
        const updates = req.body;

        try {
            logger.debug('Updating file', {fileId, updates});

            const updated = await fileModel.updateFile(fileId, updates);
            if (updated) {
                logger.info('File updated successfully', {fileId});
                res.send({message: 'File updated successfully'});
            } else {
                logger.warn('File not found for update', {fileId});
                res.status(404).send({message: 'File not found'});
            }
        } catch (err) {
            logger.error('Error updating file', {
                error: err instanceof Error ? err.message : String(err),
                stack: err instanceof Error ? err.stack : undefined,
            });
            if (err instanceof Error) {
                res.status(500).send({message: 'An error occurred', error: err.message});
            } else {
                res.status(500).send({message: 'An error occurred', error: String(err)});
            }
        }
    }

    static async deleteFile(req: Request, res: Response): Promise<void> {
        logger.debug('Entering deleteFile method', {params: req.params});
        const fileModel = new FileModel(db);

        const fileId = new ObjectId(req.params.fileId);

        try {
            logger.debug('Deleting file', {fileId});

            const deleted = await fileModel.deleteFile(fileId);
            if (deleted) {
                logger.info('File deleted successfully', {fileId});
                res.send({message: 'File deleted successfully'});
            } else {
                logger.warn('File not found for deletion', {fileId});
                res.status(404).send({message: 'File not found'});
            }
        } catch (err) {
            logger.error('Error deleting file', {
                error: err instanceof Error ? err.message : String(err),
                stack: err instanceof Error ? err.stack : undefined,
            });
            if (err instanceof Error) {
                res.status(500).send({message: 'Operation failed', error: err.message});
            } else {
                res.status(500).send({message: 'Operation failed', error: String(err)});
            }
        }
    }
}

