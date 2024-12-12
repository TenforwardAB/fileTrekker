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
 * Created on 12/11/24 :: 8:12AM BY joyider <andre(-at-)sess.se>
 *
 * This file :: defaultLogger.ts is part of the fileTrekker project.
 */

import fs from 'fs';
import path from 'path';

import {LogLevel, LoggerPlugin} from "../../types";

const logFilePath = path.join(__dirname, '../../../logs/fileTrekker.log');

export const defaultLogger: LoggerPlugin = {
    write(level: LogLevel, message: string, meta?: Record<string, any>): void {
        const timestamp = new Date().toISOString();
        let logMessage = `${timestamp} [${level.toUpperCase()}]: ${message}`;

        if (meta) {
            logMessage += ` | Meta: ${JSON.stringify(meta, null, 2)}`;
        }

        logMessage += '\n';

        fs.appendFileSync(logFilePath, logMessage, 'utf8');
    },
};
