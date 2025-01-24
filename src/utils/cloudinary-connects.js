import { v2 as cloudinary } from "cloudinary"
import fs from "fs"
import { ApiError } from "./api-error.js";

cloudinary.config({
    cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
    api_key: process.env.CLOUDINARY_CLOUD_KEY,
    api_secret: process.env.CLOUDINARY_CLOUD_SECRET
});

export const uploadOnCloudinary = async (filePath, resource_type = "auto") => {
    if (!filePath) return null
    try {
        const uploadResult = await cloudinary.uploader.upload(
            filePath,
            {
                resource_type
            }
        )
        fs.unlinkSync(filePath)
        return uploadResult
    } catch (error) {
        fs.unlinkSync(filePath)
        throw new ApiError(401, "Failed to upload on clodinary")
    }
}

const getPublicIdFromLUrl = (url) => {
    const regex = /\/(?:v\d+\/)?([^\/]+)\.[a-zA-Z]+$/;
    const match = url?.match(regex);
    return match ? match[1] : null;
}

export const deleteFromClodinary = async (fileUrl) => {
    const publicId = await getPublicIdFromLUrl(fileUrl)
    if (!publicId) return null
    try {
        await cloudinary.uploader.destroy(publicId)

    } catch (error) {
        console.error(401, "Failed deletion from Cloudinary")
    }

}