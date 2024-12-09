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
 * Created on 12/8/24 :: 9:37PM BY joyider <andre(-at-)sess.se>
 *
 * This file :: jwtAuth.ts is part of the fileTrekker project.
 */

import { NextFunction, Request, Response, RequestHandler } from 'express';
import { verifyToken } from '../../utils/jwtHelper';

export interface JwtPayload {
    id: number;
    cid: string;
    customerid: string;
    iat: number;
    exp: number;
    [key: string]: any;
}

export interface AuthenticatedRequest extends Request {
    user?: JwtPayload;
}


const jwtAuth: RequestHandler = async (
    req: AuthenticatedRequest,
    res: Response,
    next: NextFunction
): Promise<void> => {
    const authHeader = req.header('Authorization');
    console.log(req.body);

    if (!authHeader || !authHeader.startsWith('Bearer ')) {
        console.error('Authorization error: No token provided');
        res.status(401).json({ message: 'No token, authorization denied' });
        return;
    }

    const token = authHeader.split(' ')[1];

    try {
        req.user = await verifyToken(token);
        if (req.body && req.body.permissions) {
            try {
                const decodedPermissions = await verifyToken(req.body.permissions);

                req.body.permissions = decodedPermissions;
            } catch (err) {
                console.error('Permissions JWT error: Invalid token', err);
                res.status(400).json({ message: 'Invalid permissions token' });
                return;
            }
        }
        next();
    } catch (err) {
        console.error('Authorization error: Invalid token', err);
        res.status(401).json({ message: 'Token is not valid' });
        return;
    }
};

export const authMiddleware = jwtAuth;

