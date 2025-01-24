import express, { json } from "express"
import cors from "cors"
import cookieParser from "cookie-parser"


const app = express()

const env = process.env

app.use(cors({
    origin: [env.CORS_ORIGIN1, env.CORS_ORIGIN2, env.CORS_ORIGIN3],
    credentials: true
}))

app.use(express.json({ limit: '16kb' }))
app.use(express.urlencoded({ extended: true, limit: '16kb' }))
app.use(express.static("public"))
app.use(cookieParser());

// open route
app.get('/ping', (req, res) => {
    res.send('Welcome to the API')
})

// Routes
import userRouter from "./routes/user.routes.js"
import projectRouter from "./routes/project.routes.js"

app.use('/api/v1/user', userRouter)
app.use('/api/v1/project', projectRouter)

export { app }