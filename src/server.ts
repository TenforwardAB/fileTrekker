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
 * Created on 12/4/24 :: 2:23PM BY joyider <andre(-at-)sess.se>
 *
 * This file :: server.ts is part of the fileTrekker project.
 */

import express from 'express';
import dotenv from 'dotenv';
import bodyParser from 'body-parser';
import cors from 'cors';
import { initializeDatabase } from './config/database';
import fileRoutes from './routes/fileRoutes';
import folderRoutes from './routes/folderRoutes';

import {logger} from "./services/loggerService";

dotenv.config();

function registerRoute(path: string, router: express.Router) {
    logger.info(`Registering routes: ${path}`);
    app.use(path, (req, res, next) => {
        next();
    }, router);
}

const app = express();
logger.info("Starting fileTrekker")
app.use(bodyParser.json());
app.use(cors());

const PORT = process.env.PORT || 4000;
logger.info("Setting Port: " + PORT);


initializeDatabase()
  .then(() => {
    logger.info('Database initialized successfully');

    registerRoute('/api/files', fileRoutes);
    registerRoute('/api/folders', folderRoutes);

    app.listen(PORT, () => {
      logger.debug(`Server running on port ${PORT}`);
    });
  })
  .catch((err) => {
    logger.error('Failed to initialize database: ' + err.message);
    process.exit(1);
  });