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

import { Router } from 'express';

const router = Router();

// GET: Fetch all folders
router.get('/', (req, res) => {
  res.json({ message: 'Fetch all folders' });
});

// POST: Create a new folder
router.post('/', (req, res) => {
  const { name, parent, owner } = req.body;
  res.json({ message: 'Folder created', folder: { name, parent, owner } });
});

// GET: Fetch a single folder by ID
router.get('/:id', (req, res) => {
  const { id } = req.params;
  res.json({ message: `Fetch folder with ID: ${id}` });
});

// PUT: Update a folder by ID
router.put('/:id', (req, res) => {
  const { id } = req.params;
  const updates = req.body;
  res.json({ message: `Folder with ID: ${id} updated`, updates });
});

// DELETE: Delete a folder by ID
router.delete('/:id', (req, res) => {
  const { id } = req.params;
  res.json({ message: `Folder with ID: ${id} deleted` });
});

export default router;
