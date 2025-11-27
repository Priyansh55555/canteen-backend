import express from "express";
import cors from "cors";
import cookieParser from "cookie-parser";
import routes from "./routes/index.js";

const app = express();

app.use(cors());
app.use(express.json());
app.use(cookieParser());

// Centralized Routes
app.use("/api", routes);

export default app;
