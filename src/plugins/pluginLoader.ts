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
 * Created on 12/8/24 :: 9:31PM BY joyider <andre(-at-)sess.se>
 *
 * This file :: pluginLoader.ts is part of the fileTrekker project.
 */

import path from 'path';

type Plugin = {
    [key: string]: unknown;
};

export const loadPlugin = <T extends Plugin>(pluginType: string): T => {
    const { config } = require('../config');
    const pluginName = config[`${pluginType}Plugin`];

    try {
        const pluginPath = path.join(__dirname, pluginType, pluginName);

        const plugin = require(pluginPath);
        return plugin as T;
    } catch (error) {
        console.warn(
            `Failed to load plugin "${pluginName}" for type "${pluginType}". Falling back to default plugin.`
        );

        const defaultPluginPath = path.join(__dirname, pluginType, `default${capitalize(pluginType)}`);
        const defaultPlugin = require(defaultPluginPath);
        return defaultPlugin as T;
    }
};

const capitalize = (str: string): string => str.charAt(0).toUpperCase() + str.slice(1);