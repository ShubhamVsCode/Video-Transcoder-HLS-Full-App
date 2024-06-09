import { Router } from "express";
import { uploadVideo } from "../controller/upload";

const uploadRouter = Router();

uploadRouter.post("/", uploadVideo);

export default uploadRouter;
