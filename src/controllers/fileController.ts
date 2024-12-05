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
import {ObjectId} from 'mongodb';
import {GridFSBucket} from 'mongodb';

export class FileController {
    static uploadFile = async (req: Request, res: Response): Promise<void> => {
        const fileModel = new FileModel(db);
        const bucket = new GridFSBucket(db);

        const {owner, parent} = req.body;
        const file = req.file;

        if (!file) {
            res.status(400).send({message: 'No file uploaded'});
            return;
        }

        try {
            const uploadStream = bucket.openUploadStream(file.originalname, {
                metadata: {
                    owner: new ObjectId(owner),
                    parent: parent ? new ObjectId(parent) : null,
                },
            });
            uploadStream.end(file.buffer);

            uploadStream.on('finish', async () => {
                const fileId = await fileModel.createFile({
                    name: file.originalname,
                    path: `/files/${uploadStream.id}`, // Reference to GridFS ID
                    size: file.size,
                    owner: new ObjectId(owner),
                    parent: parent ? new ObjectId(parent) : null,
                });
                res.status(201).send({fileId});
            });

            uploadStream.on('error', (err) => {
                res.status(500).send({message: 'File upload failed', error: err.message});
            });
        } catch (err) {
            if (err instanceof Error) {
                res.status(500).send({message: 'File upload failed', error: err.message});
            } else {
                res.status(500).send({message: 'File upload failed', error: String(err)});
            }
        }
    };

    static async listFiles(req: Request, res: Response) {
        const fileModel = new FileModel(db);

        const ownerId = new ObjectId(req.params.ownerId);

        try {
            const files = await fileModel.listFiles(ownerId);
            res.send(files);
        } catch (err) {
            if (err instanceof Error) {
                res.status(500).send({message: 'Failed to list files', error: err.message});
            } else {
                res.status(500).send({message: 'Failed to list files', error: String(err)});
            }
        }

    }

    static async updateFile(req: Request, res: Response) {
        const fileModel = new FileModel(db);

        const fileId = new ObjectId(req.params.fileId);
        const updates = req.body;

        try {
            const updated = await fileModel.updateFile(fileId, updates);
            if (updated) {
                res.send({message: 'File updated successfully'});
            } else {
                res.status(404).send({message: 'File not found'});
            }
        } catch (err) {
            if (err instanceof Error) {
                res.status(500).send({message: 'An error occurred', error: err.message});
            } else {
                res.status(500).send({message: 'An error occurred', error: String(err)});
            }
        }

    }

    static async deleteFile(req: Request, res: Response) {
        const fileModel = new FileModel(db);

        const fileId = new ObjectId(req.params.fileId);

        try {
            const deleted = await fileModel.deleteFile(fileId);
            if (deleted) {
                res.send({message: 'File deleted successfully'});
            } else {
                res.status(404).send({message: 'File not found'});
            }
        } catch (err) {
            if (err instanceof Error) {
                res.status(500).send({message: 'Operation failed', error: err.message});
            } else {
                res.status(500).send({message: 'Operation failed', error: String(err)});
            }
        }

    }
}
