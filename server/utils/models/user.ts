import { Schema, model } from 'mongoose';
import type { IUser, UserModel } from '~~/shared/types/mongoose/user';

const UserSchema = new Schema<IUser, UserModel>({
	pid: Number,
	splash_tag_classes: String
});

export const User = model<IUser, UserModel>('User', UserSchema);
