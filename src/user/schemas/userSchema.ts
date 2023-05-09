import {Schema} from "mongoose";
export const userSchema = new Schema ({
    email: {type: String, required: true},
    },
    {timestamps: true}
)