import { Router } from "express";
import {
    currentUser,
    loginUser,
    logoutUser,
    registerUser,
    updateAvatar,
    updatePassword,
    updateUser
} from "../controllers/user.controller.js";
import { verifyJwt } from "../middlewares/auth.middleware.js";
import { upload } from "../middlewares/multer.middleware.js";

const router = Router()

router.route('/register-user').post(registerUser)
router.route('/login-user').post(loginUser)
router.route('/logout-user').get(verifyJwt, logoutUser)

router.route('/update-user').patch(verifyJwt, updateUser)
router.route('/update-avatar').patch(verifyJwt, upload.single('avatar'), updateAvatar)
router.route('/update-password').patch(verifyJwt, updatePassword)

router.route('/current-user').get(verifyJwt, currentUser)

export default router