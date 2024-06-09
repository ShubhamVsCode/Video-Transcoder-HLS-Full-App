import { Request, Response } from "express";
import { getPresignedUrl } from "../lib/aws";
import { markVideoAsUploading } from "../lib/redis";

export const uploadVideo = async (req: Request, res: Response) => {
  try {
    const presignedUrl = await getPresignedUrl(req.body.filename);
    await markVideoAsUploading(req.body.filename);
    res.json({ message: "Presigned URL Generated", url: presignedUrl });
  } catch (error) {
    console.log(error);
    res.status(500).json({ message: "Error uploading video" });
  }
};
