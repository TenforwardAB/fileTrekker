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
 * Created on 12/4/24 :: 2:18PM BY joyider <andre(-at-)sess.se>
 *
 * This file :: abacMiddleware.ts is part of the fileTrekker project.
 */

import { Request, Response, NextFunction } from 'express';

export const abacMiddleware = (req: Request, res: Response, next: NextFunction) => {
    //TODO: Mock only need, implementetion
  const userAttributes = req.headers['user-attributes']; // Mock,
  const resourceAttributes = req.headers['resource-attributes']; // Mock only

  if (userAttributes && resourceAttributes) {
    return next();
  }

  return res.status(403).json({ message: 'Forbidden' });
};
