import mongoose from 'mongoose';
const { Schema, model } = mongoose;
import passportLocalMongoose from 'passport-local-mongoose';

const UserSchema = new Schema({});

UserSchema.plugin(passportLocalMongoose);
const User = model('user', UserSchema);
export default User;
