import express from "express";
import cors from "cors";
import cookieParser from "cookie-parser";
import routes from "./routes/index.js";
import { errorHandler } from "./middleware/errorHandler.js";

const app = express();

app.use(cors({
    origin: "http://localhost:5173",   // your frontend URL
    credentials: true,                 // allow cookies
  }));
app.use(express.json());
app.use(cookieParser());

app.use((req, _,next)=>{
    console.log("url", req.headers.origin);
    console.log("cookies", req.headers.cookies);
    next();
})
// Centralized Routes
app.use("/api", routes);


// GLOBAL ERROR HANDLER (always last)
app.use(errorHandler);

export default app;
