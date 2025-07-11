import mongoose from "mongoose";

const UserSchema = mongoose.Schema(
    {
        username: {
            type: String,
            required: true
        },
        email: {
            type: String,
            required: true,
            unique: true
        },
        password: {
            type: String,
            required: true
        },
        fcmToken: {
            type: String,
            required: true
        },

    },
    {
        timestamps: true,

    }
);


export const User = mongoose.model('User', UserSchema)
export default User;