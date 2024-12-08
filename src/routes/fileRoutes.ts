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

const router = express.Router();
const upload = multer({
  storage: multer.memoryStorage(),
  limits: { fileSize: 150 * 1024 * 1024 },
});
router.post('/', upload.single('file'), FileController.uploadFile);
router.get('/:ownerId', FileController.listFiles);
router.put('/:fileId', FileController.updateFile);
router.delete('/:fileId', FileController.deleteFile);

export default router;
