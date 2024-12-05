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
 * Created on 12/4/24 :: 2:27 PM BY joyider <andre(-at-)sess.se>
 *
 * This file :: folderRoutes.ts is part of the fileTrekker project.
 */

import express from 'express';
import { FolderController } from '../controllers/folderController';

const router = express.Router();

// Create folder
router.post('/', FolderController.createFolder);

// List folders for a user
router.get('/:ownerId', FolderController.listFolders);

// Update folder
router.put('/:folderId', FolderController.updateFolder);

// Delete folder
router.delete('/:folderId', FolderController.deleteFolder);

export default router;
