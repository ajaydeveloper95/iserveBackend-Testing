import { Schema, model } from "mongoose";

const paymentSchema = new Schema({
    name: {
        type: String,
    },
    amount: {
        type: String,
    },
    isActive: {
        type: Boolean,
        default: true
    },
}, { timestamps: true });

export default new model("payment", paymentSchema);