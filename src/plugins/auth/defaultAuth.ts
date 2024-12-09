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
 * Created on 12/8/24 :: 9:36PM BY joyider <andre(-at-)sess.se>
 *
 * This file :: defaultAuth.ts is part of the fileTrekker project.
 */

import { Request, Response, NextFunction } from 'express';

export const defaultAuth = (req: Request, res: Response, next: NextFunction): void => {
    console.warn('No authentication applied.');
    next();
};