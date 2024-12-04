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
 * Created on 12/4/24 :: 1:52PM BY joyider <andre(-at-)sess.se>
 *
 * This file :: folderModel.ts is part of the fileTrekker project.
 */

import mongoose, { Schema, Model, Document, Types } from 'mongoose';

// Define the interface for the plain folder data
export interface IFolder {
  name: string;
  parent: Types.ObjectId | null;
  owner: Types.ObjectId;
  sharedWith: Types.ObjectId[];
  group: Types.ObjectId | null;
}

// Define the interface for the folder document (Mongoose document)
export interface IFolderDocument extends IFolder, Document {}

// Define the model interface (static methods)
export interface IFolderModel extends Model<IFolderDocument> {}

// Define the schema
const folderSchema = new Schema<IFolderDocument, IFolderModel>({
  name: { type: String, required: true },
  parent: { type: Schema.Types.ObjectId, ref: 'Folder', default: null },
  owner: { type: Schema.Types.ObjectId, ref: 'User', required: true },
  sharedWith: [{ type: Schema.Types.ObjectId, ref: 'User' }],
  group: { type: Schema.Types.ObjectId, ref: 'Group', default: null },
}, {
  timestamps: true,
  toJSON: { virtuals: true },
  toObject: { virtuals: true },
});

// Create the model explicitly with all required types
const FolderModel = mongoose.model<IFolderDocument, IFolderModel>('Folder', folderSchema);

export default FolderModel;
