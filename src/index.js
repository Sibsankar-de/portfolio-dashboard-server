import { app } from "./app.js";
import dotenv from "dotenv"
import { connectDb } from "./db/index.js";

dotenv.config({
    path: './env'
})


console.log = console.warn = console.error = () => { };

connectDb()
    .then(() => {
        app.listen(process.env.PORT || 4000, () => {
            console.log("Server is listening at port:", process.env.PORT);
        })
    })