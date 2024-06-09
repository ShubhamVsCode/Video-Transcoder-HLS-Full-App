const {
  S3Client,
  GetObjectCommand,
  PutObjectCommand,
} = require("@aws-sdk/client-s3");
const { ECSClient, StopTaskCommand } = require("@aws-sdk/client-ecs");
const { exec } = require("child_process");
const fs = require("fs");
const path = require("path");

const s3Client = new S3Client({ region: "ap-south-1" });
const ecsClient = new ECSClient({ region: "ap-south-1" });

const downloadFromS3 = async (bucket, key, downloadPath) => {
  const params = {
    Bucket: bucket,
    Key: key,
  };
  const command = new GetObjectCommand(params);

  try {
    const data = await s3Client.send(command);
    const stream = data.Body;
    return new Promise((resolve, reject) => {
      const file = fs.createWriteStream(downloadPath);
      stream.pipe(file);
      file.on("finish", () => resolve(downloadPath));
      file.on("error", reject);
    });
  } catch (error) {
    console.error("Error downloading from S3:", error);
    throw error;
  }
};

const uploadToS3 = async (filePath, bucketName, key) => {
  try {
    const fileContent = fs.readFileSync(filePath);
    const uploadParams = {
      Bucket: bucketName,
      Key: key,
      Body: fileContent,
    };
    await s3Client.send(new PutObjectCommand(uploadParams));
    console.log(`File uploaded successfully: ${key}`);
  } catch (err) {
    console.error("Error uploading file:", err);
  }
};

const processVideo = async (
  objectKey,
  inputFile,
  outputDir,
  bucketName,
  resolutions,
) => {
  try {
    for (const res of resolutions) {
      const hlsPath = path.join(outputDir, `hls_${res}p`);
      const outputPath = path.join(outputDir, `output_${res}p`);
      fs.mkdirSync(outputPath, { recursive: true });

      const command = `ffmpeg -i ${inputFile} -vf "scale=-2:${res}" -codec:v libx264 -codec:a aac -hls_time 10 -hls_playlist_type vod -hls_segment_filename "${outputPath}/segment%03d.ts" -start_number 0 ${hlsPath}.m3u8`;

      await new Promise((resolve, reject) => {
        exec(command, (error, stdout, stderr) => {
          if (error) {
            console.error(`Error running FFmpeg: ${error}`);
            reject(error);
          } else {
            console.log(`FFmpeg output: ${stdout}`);
            resolve();
          }
        });
      });

      await uploadToS3(
        `${hlsPath}.m3u8`,
        bucketName,
        `${objectKey}/output_${res}p/hls_${res}p.m3u8`,
      );
      const segmentFiles = fs
        .readdirSync(outputPath)
        .filter((file) => file.endsWith(".ts"));
      for (const segment of segmentFiles) {
        await uploadToS3(
          path.join(outputPath, segment),
          bucketName,
          `${objectKey}/output_${res}p/${segment}`,
        );
      }
    }
  } catch (error) {
    console.error("Error processing video:", error);
  }
};

const shutdownECSTask = async (clusterName, taskArn) => {
  try {
    const command = new StopTaskCommand({
      cluster: clusterName,
      task: taskArn,
    });
    await ecsClient.send(command);
    console.log("ECS task shutdown successfully");
  } catch (error) {
    console.error("Error shutting down ECS task:", error);
  }
};

const main = async () => {
  const bucketName = process.env.VIDEO_BUCKET;
  const inputKey = process.env.VIDEO_KEY;
  const inputFilePath = "/tmp/input.mp4";
  const outputDir = "/tmp/output";
  const targetBucket = "hls-prod.shubhamvscode";
  const resolutions = ["360", "480", "720"];
  const clusterName = "hls-cluster";
  const taskArn = process.env.ECS_TASK_ARN;

  try {
    // Ensure the output directory exists
    if (!fs.existsSync(outputDir)) {
      fs.mkdirSync(outputDir, { recursive: true });
    }

    // Download the video from S3
    await downloadFromS3(bucketName, inputKey, inputFilePath);

    // Process the video into HLS format with different resolutions
    await processVideo(
      inputKey,
      inputFilePath,
      outputDir,
      targetBucket,
      resolutions,
    );

    // Shutdown the ECS task
    // await shutdownECSTask(clusterName, taskArn);
  } catch (error) {
    console.error("Error in main process:", error);
  }
};

main();
