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
 * Created on 12/4/24 :: 1:50PM BY joyider <andre(-at-)sess.se>
 *
 * This file :: fileModel.ts is part of the fileTrekker project.
 */

import mongoose, { Schema, Model, Document, Types } from 'mongoose';

// Define the interface for the plain file data
export interface IFile {
  name: string;
  path: string;
  size: number;
  owner: Types.ObjectId;
  sharedWith: Types.ObjectId[];
  group: Types.ObjectId | null;
}

// Define the interface for the document instance (Mongoose document)
export interface IFileDocument extends IFile, Document {}

// Define the model interface (static methods)
export interface IFileModel extends Model<IFileDocument> {}

// Define the schema
const fileSchema = new Schema<IFileDocument, IFileModel>({
  name: { type: String, required: true },
  path: { type: String, required: true },
  size: { type: Number, required: true },
  owner: { type: Schema.Types.ObjectId, ref: 'User', required: true },
  sharedWith: [{ type: Schema.Types.ObjectId, ref: 'User' }],
  group: { type: Schema.Types.ObjectId, ref: 'Group', default: null },
}, {
  timestamps: true,
  toJSON: { virtuals: true },
  toObject: { virtuals: true },
});

// Create the model explicitly with all required types
const FileModel = mongoose.model<IFileDocument, IFileModel>('File', fileSchema);

export default FileModel;
