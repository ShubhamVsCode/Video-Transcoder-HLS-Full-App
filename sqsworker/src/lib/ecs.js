import { ECSClient, RunTaskCommand } from "@aws-sdk/client-ecs";
import { ENV } from "../constant/env.js";

const ecsClient = new ECSClient({
  region: ENV.AWS_REGION,
  credentials: {
    accessKeyId: ENV.AWS_ACCESS_KEY,
    secretAccessKey: ENV.AWS_SECRET_ACCESS_KEY,
  },
});

export const runTask = async (runTaskParams) => {
  return ecsClient.send(new RunTaskCommand(runTaskParams));
};
