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
 * Created on 12/11/24 :: 8:43AM BY joyider <andre(-at-)sess.se>
 *
 * This file :: types.ts is part of the fileTrekker project.
 */

export type LogLevel = 'debug' | 'info' | 'warn' | 'error' | 'critical';
export type LoggerPlugin = {
    write: (level: LogLevel, message: string, meta?: Record<string, any>) => void;
};
