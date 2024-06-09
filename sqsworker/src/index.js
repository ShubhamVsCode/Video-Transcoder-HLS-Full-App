import { receiveMessages, deleteMessage } from "./lib/sqs.js";
import { processMessage } from "./utils/processMessage.js";

const pollMessages = async () => {
  while (true) {
    const data = await receiveMessages();
    if (data.Messages) {
      for (const message of data.Messages) {
        await processMessage(message);
        await deleteMessage(message.ReceiptHandle);
      }
    } else {
      console.log("No messages to process");
    }
    await new Promise((resolve) => setTimeout(resolve, 1000));
  }
};

pollMessages();
