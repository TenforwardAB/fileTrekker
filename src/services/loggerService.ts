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
 * Created on 12/11/24 :: 8:11AM BY joyider <andre(-at-)sess.se>
 *
 * This file :: loggerService.ts is part of the fileTrekker project.
 */

import { loadPlugin } from '../plugins/pluginLoader';
import {LogLevel, LoggerPlugin} from "../types";
import dotenv from 'dotenv';

dotenv.config();

class LoggerService {
    private logLevel: LogLevel;
    private logger: LoggerPlugin;

    constructor() {
        console.log('LoggerService instance created');
        this.logLevel = (process.env.LOG_LEVEL || 'info') as LogLevel;
        console.log(this.logLevel);

        const plugin = loadPlugin<{ [key: string]: LoggerPlugin }>('logger');

        const [loggerInstance] = Object.values(plugin);

        if (!loggerInstance || typeof loggerInstance.write !== 'function') {
            throw new Error('Loaded logger plugin is invalid or missing the "write" method.');
        }

        this.logger = loggerInstance;
    }

    private shouldLog(level: LogLevel): boolean {
        const levels: LogLevel[] = ['debug', 'info', 'warn', 'error', 'critical'];
        return levels.indexOf(level) >= levels.indexOf(this.logLevel);
    }

    log(level: LogLevel, message: string, meta?: Record<string, any>): void {
        if (this.shouldLog(level)) {
            this.logger.write(level, message, meta);
        }
    }

    debug(message: string, meta?: Record<string, any>): void {
        this.log('debug', message, meta);
    }

    info(message: string, meta?: Record<string, any>): void {
        this.log('info', message, meta);
    }

    warn(message: string, meta?: Record<string, any>): void {
        this.log('warn', message, meta);
    }

    error(message: string, meta?: Record<string, any>): void {
        this.log('error', message, meta);
    }

    critical(message: string, meta?: Record<string, any>): void {
        this.log('critical', message, meta);
    }
}

export const logger = new LoggerService();