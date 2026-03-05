import mongoose, {Schema, Document} from "mongoose";

export interface IStudent extends Document{
    email: string;
    password: string;
    isActive: boolean
}

const studentSchema = new Schema<IStudent>({
    email: {
        type: String,
        required: true,
        unique: true
    },

    password: {
        type: String,
        required: true
    },

    isActive: {
        type: Boolean,
        default: true
    }
});

export default mongoose.model<IStudent>("students", studentSchema);