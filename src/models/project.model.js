import mongoose, { Schema } from "mongoose";

const projectSchema = new Schema({
    title: {
        type: String,
        required: true
    },
    description: {
        type: String,
        required: true,
    },
    imageList: [
        {
            imageUrl: {
                type: String
            }
        }
    ],
    buttons: [
        {
            buttonType: {
                type: String
            },
            buttonUrl: {
                type: String
            },
            active:{
                type: Boolean,
                default: false
            }
        }
    ],
    tagList: [
        {
            type: String
        }
    ],
    active: {
        type: Boolean,
        required: true,
        default: true
    }
}, { timestamps: true })

export const Project = mongoose.model("Project", projectSchema)