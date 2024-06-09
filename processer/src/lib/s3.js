import {
  S3Client,
  GetObjectCommand,
  PutObjectCommand,
} from "@aws-sdk/client-s3";
import { createWriteStream, readFileSync } from "fs";
import { ENV } from "../constant/env.js";

const s3Client = new S3Client({
  region: ENV.AWS_REGION,
  credentials: {
    accessKeyId: ENV.AWS_ACCESS_KEY,
    secretAccessKey: ENV.AWS_SECRET_ACCESS_KEY,
  },
});

export async function downloadFromS3(bucket, key, downloadPath) {
  console.log("Downloading video from S3");
  const params = { Bucket: bucket, Key: key };
  const command = new GetObjectCommand(params);
  try {
    const data = await s3Client.send(command);
    const stream = data.Body;
    return new Promise((resolve, reject) => {
      const file = createWriteStream(downloadPath);
      stream.pipe(file);
      file.on("finish", () => resolve(downloadPath));
      file.on("error", reject);
    });
  } catch (error) {
    console.error("Error downloading from S3:", error);
    throw error;
  }
}

export async function uploadToS3(filePath, bucketName, key) {
  console.log("Uploading video to S3");
  try {
    const fileContent = readFileSync(filePath);
    const uploadParams = { Bucket: bucketName, Key: key, Body: fileContent };
    await s3Client.send(new PutObjectCommand(uploadParams));
    console.log(`File uploaded successfully: ${key}`);
  } catch (err) {
    console.error("Error uploading file:", err);
  }
}
