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
 * Created on 12/4/24 :: 2:26 PM BY joyider <andre(-at-)sess.se>
 *
 * This file :: fileRoutes.ts is part of the fileTrekker project.
 */

import express from 'express';
import multer from 'multer';
import { FileController } from '../controllers/fileController';
import {logger} from "../services/loggerService";

const router = express.Router();
const upload = multer({
  storage: multer.memoryStorage(),
  limits: { fileSize: 150 * 1024 * 1024 },
});
router.post('/', upload.single('file'), (req, res, next) => {
  logger.info('Handling file upload');
  next();
}, FileController.uploadFile);

router.get('/:ownerId', (req, res, next) => {
  logger.info(`Listing files for ownerId: ${req.params.ownerId}`);
  next();
}, FileController.listFiles);

router.put('/:fileId', (req, res, next) => {
  logger.info(`Updating file with fileId: ${req.params.fileId}`);
  next();
}, FileController.updateFile);

router.delete('/:fileId', (req, res, next) => {
  logger.info(`Deleting file with fileId: ${req.params.fileId}`);
  next();
}, FileController.deleteFile);

export default router;
