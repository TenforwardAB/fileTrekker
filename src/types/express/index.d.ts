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
 * Created on 12/5/24 :: 1:39PM BY joyider <andre(-at-)sess.se>
 *
 * This file :: index.d.ts is part of the fileTrekker project.
 */

import { Request } from 'express';

declare global {
  namespace Express {
    interface MulterFile {
      fieldname: string;
      originalname: string;
      encoding: string;
      mimetype: string;
      size: number;
      buffer: Buffer; // Included when using `memoryStorage`
    }

    interface Request {
      file?: MulterFile; // Single file upload
      files?: MulterFile[]; // Multiple file uploads
    }
  }
}
