import { Request, Response } from "express";
import {
  getAllVideosStatus,
  getVideoStatus,
  markVideoAsUploaded,
} from "../lib/redis";

export const getAllVideos = async (req: Request, res: Response) => {
  const videos = await getAllVideosStatus();
  res.json({ videos });
};

export const getStatus = async (req: Request, res: Response) => {
  const { id } = req.params;
  const status = await getVideoStatus(id);
  res.json({ status });
};

export const updateStatus = async (req: Request, res: Response) => {
  const { id } = req.body;
  const status = await markVideoAsUploaded(id);
  res.json({ status });
};
