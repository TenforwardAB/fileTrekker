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
 * Created on 12/8/24 :: 10:15PM BY joyider <andre(-at-)sess.se>
 *
 * This file :: jwtHelper.ts is part of the fileTrekker project.
 */

import { JWK, JWS } from 'node-jose';
import axios from 'axios';

const portalOrigin = process.env.PORTAL_ORIGIN || "https://hub.aireview.se";
const JWKS_URI = `${portalOrigin}/api/auth/.well-known/jwks.json`;

let jwksCache: { keystore: JWK.KeyStore; fetchedAt: number } | null = null;
const CACHE_DURATION = 10 * 60 * 1000; // Cache for 10 minutes

async function fetchJWKS(): Promise<JWK.KeyStore> {
    const now = Date.now();
    if (jwksCache && now - jwksCache.fetchedAt < CACHE_DURATION) {
        console.log("Using cached JWKS");
        return jwksCache.keystore;
    }

    console.log("Fetching JWKS from API");
    const response = await axios.get(JWKS_URI);
    const keys = response.data.keys;

    const keystore = JWK.createKeyStore();
    for (const key of keys) {
        await keystore.add(key);
    }

    jwksCache = { keystore, fetchedAt: now };
    return keystore;
}

async function getKey(header: { kid?: string }): Promise<JWK.Key> {
    const keystore = await fetchJWKS();

    if (header.kid) {
        const key = keystore.get(header.kid);
        if (!key) {
            throw new Error(`Key with kid "${header.kid}" not found`);
        }
        return key;
    } else {
        console.warn("No 'kid' found in JWT header. Using the first key from JWKS.");
        return keystore.all()[0]; // fallback to the first key
    }
}

export async function verifyToken(token: string): Promise<any> {
    try {
        const { payload } = await JWS.createVerify(await fetchJWKS()).verify(token);
        return JSON.parse(payload.toString());
    } catch (error) {
        throw new Error("Invalid or expired token");
    }
}