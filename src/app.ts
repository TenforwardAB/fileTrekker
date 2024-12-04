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
 * Created on 12/4/24 :: 2:22PM BY joyider <andre(-at-)sess.se>
 *
 * This file :: app.ts is part of the fileTrekker project.
 */

import express from 'express';
import dotenv from 'dotenv';
import bodyParser from 'body-parser';
import cors from 'cors';
import connectDB from './config/database';
import fileRoutes from './routes/fileRoutes';
import folderRoutes from './routes/folderRoutes';

dotenv.config();

const app = express();
app.use(bodyParser.json());
app.use(cors());

// Connect to database
connectDB();

// Routes
app.use('/api/files', fileRoutes);
app.use('/api/folders', folderRoutes);

export default app;
