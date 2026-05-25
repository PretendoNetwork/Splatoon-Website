import type { Model, HydratedDocument } from 'mongoose';

export interface IUser {
	pid: number;
	splash_tag_classes: string;
}

export type UserModel = Model<IUser>;

export type HydratedUserDocument = HydratedDocument<IUser>;
