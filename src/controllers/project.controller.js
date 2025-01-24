import { Project } from "../models/project.model.js";
import { ApiError } from "../utils/api-error.js";
import { ApiResponse } from "../utils/api-response.js";
import { asyncHandler } from "../utils/asyncHandler.js";
import { uploadOnCloudinary } from "../utils/cloudinary-connects.js";

const createProject = asyncHandler(async (req, res) => {
    const { title, description, buttons, imageList, tagList } = req.body

    const project = await Project.create({
        title,
        description,
        buttons,
        imageList,
        tagList
    })

    if (!project) throw new ApiError(401, "Project creation failed")

    return (
        res.status(200)
            .json(new ApiResponse(200, project, "Project created successfully"))
    )
})

const uploadProjectImage = asyncHandler(async (req, res) => {
    const imagePath = req.file?.path
    if (!imagePath) throw new ApiError(400, "Image is required")

    const image = await uploadOnCloudinary(imagePath)
    return (
        res.status(200)
            .json(new ApiResponse(200, image?.url, "Image uploaded"))
    )
})

const updateProject = asyncHandler(async (req, res) => {
    const { projectId, title, description, buttons, imageList, tagList } = req.body
    if (!projectId) throw new ApiError(400, "Project is is required")

    const project = await Project.findByIdAndUpdate(
        projectId,
        {
            $set: {
                title,
                description,
                buttons,
                imageList,
                tagList
            }
        },
        {
            new: true
        }
    )


    return (
        res.status(200)
            .json(new ApiResponse(200, project, "Project updated"))
    )
})

const updateActiveState = asyncHandler(async (req, res) => {
    const { projectId, activeState } = req.body
    await Project.findByIdAndUpdate(
        projectId,
        {
            $set: {
                active: activeState
            }
        },
        {
            new: true
        }
    )

    return (
        res.status(200)
            .json(new ApiResponse(200, {}, "State updated"))
    )
})

const getProject = asyncHandler(async (req, res) => {
    const { projectId } = req.params

    if (!projectId) throw new ApiError(400, "Project Id is required")
    const project = await Project.findById(projectId)
    return (
        res.status(200)
            .json(new ApiResponse(200, project, "Project fetched successfully"))
    )
})

const projectList = asyncHandler(async (req, res) => {
    const projectList = await Project.aggregate([
        {
            $match: {}
        },
        {
            $sort: { createdAt: -1 }
        }
    ])

    return (
        res.status(200)
            .json(new ApiResponse(200, projectList, "Projectlist fetched successfully"))
    )
})

export {
    createProject,
    uploadProjectImage,
    updateProject,
    updateActiveState,
    getProject,
    projectList
}