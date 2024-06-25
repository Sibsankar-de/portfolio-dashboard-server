import express, { json } from "express"
import cors from "cors"
import cookieParser from "cookie-parser"


const app = express()

const corsOrigin = process.env.CORS_ORIGIN.split(',')

app.use(cors({
    origin: [...corsOrigin],
    credentials: true
}))

app.use(express.json({ limit: '16kb' }))
app.use(express.urlencoded({ extended: true, limit: '16kb' }))
app.use(express.static("public"))
app.use(cookieParser())

// Routes
import userRouter from "./routes/user.routes.js"
import projectRouter from "./routes/project.routes.js"

app.use('/api/v1/user', userRouter)
app.use('/api/v1/project', projectRouter)

export { app }