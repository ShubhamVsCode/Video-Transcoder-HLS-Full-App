import { Router } from "express";
import { getAllVideos, getStatus, updateStatus } from "../controller/video";

const videoRouter = Router();

videoRouter.get("/all", getAllVideos);
videoRouter.get("/:id", getStatus);
videoRouter.post("/update-status", updateStatus);

export default videoRouter;
