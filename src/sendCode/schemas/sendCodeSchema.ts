import {Schema} from "mongoose";

export const sendCodeSchema = new Schema ({
    email: {type: String, required: true},
    code: {type: String, required: true},
    expirationDate: {type: Date, required: true},
    }, {timestamps: true}
)