import { Router } from "express";
import { createProject, getProject, projectList, updateActiveState, updateProject, uploadProjectImage } from "../controllers/project.controller.js";
import { upload } from "../middlewares/multer.middleware.js";

const router = Router()

router.route("/create-project").post(createProject)
router.route("/project-image").post(upload.single("image"), uploadProjectImage)

router.route("/update-project").patch(updateProject)
router.route("/update-state").patch(updateActiveState)
router.route("/get-project/:projectId").get(getProject)

router.route("/project-list").get(projectList)


export default router