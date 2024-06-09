import {
  SQSClient,
  ReceiveMessageCommand,
  DeleteMessageCommand,
} from "@aws-sdk/client-sqs";
import { ENV } from "../constant/env.js";

const sqsClient = new SQSClient({
  region: ENV.AWS_REGION,
  credentials: {
    accessKeyId: ENV.AWS_ACCESS_KEY,
    secretAccessKey: ENV.AWS_SECRET_ACCESS_KEY,
  },
});

export const receiveMessages = async () => {
  const params = {
    QueueUrl: ENV.QUEUE_URL,
    MaxNumberOfMessages: 1,
    WaitTimeSeconds: 3,
  };

  return sqsClient.send(new ReceiveMessageCommand(params));
};

export const deleteMessage = async (receiptHandle) => {
  const deleteParams = {
    QueueUrl: ENV.QUEUE_URL,
    ReceiptHandle: receiptHandle,
  };
  return sqsClient.send(new DeleteMessageCommand(deleteParams));
};
