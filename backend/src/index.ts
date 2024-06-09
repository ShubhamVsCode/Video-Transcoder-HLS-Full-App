import express from "express";
import cors from "cors";
import dotenv from "dotenv";
import uploadRouter from "./routes/upload";
import videoRouter from "./routes/video";
dotenv.config();

const app = express();

app.use(cors());
app.use(express.json());

app.use("/api/upload", uploadRouter);
app.use("/api/video", videoRouter);

app.listen(8080, () => {
  console.log("Server is running on port 8080");
});
