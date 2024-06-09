import { runTask } from "../lib/ecs.js";
import { markVideoAsProcessing } from "../lib/redis.js";

const cluster = "hls";
const taskDefinition = "hls-td";
const containerName = "hls-container";
const subnets = ["subnet-08ffc70d81c2c946e"];

export const processMessage = async (message) => {
  try {
    const videoDetails = JSON.parse(message.Body);
    const bucket = videoDetails.Records[0].s3.bucket.name;
    const key = videoDetails.Records[0].s3.object.key;

    console.log("Processing Video:", key);

    await markVideoAsProcessing(`video:${key}:status`, "processing");

    const runTaskParams = {
      cluster,
      taskDefinition,
      launchType: "FARGATE",
      networkConfiguration: {
        awsvpcConfiguration: {
          subnets,
          assignPublicIp: "ENABLED",
        },
      },
      overrides: {
        containerOverrides: [
          {
            name: containerName,
            environment: [
              { name: "VIDEO_DETAILS", value: JSON.stringify(videoDetails) },
              { name: "VIDEO_BUCKET", value: bucket },
              { name: "VIDEO_KEY", value: key },
            ],
          },
        ],
      },
    };

    const response = await runTask(runTaskParams);
    console.log("ECS Task started:", response.tasks?.[0]?.taskDefinitionArn);
  } catch (error) {
    console.error("Error processing message:", error);
  }
};
