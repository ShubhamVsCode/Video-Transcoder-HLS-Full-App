import { processVideo } from "./utils/videoProcessor.js";
import { shutdownECSTask } from "./lib/ecs.js";
import { markVideoAsProcessed } from "./lib/redis.js";
import { downloadFromS3 } from "./lib/s3.js";

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
    await downloadFromS3(bucketName, inputKey, inputFilePath);
    await processVideo(
      inputKey,
      inputFilePath,
      outputDir,
      targetBucket,
      resolutions,
    );
    await markVideoAsProcessed(`video:${inputKey}:status`, "processed");
    // await shutdownECSTask(clusterName, taskArn);
  } catch (error) {
    console.error("Error in main process:", error);
    await markVideoAsProcessed(`video:${inputKey}:status`, "failed");
  }
};

main();
