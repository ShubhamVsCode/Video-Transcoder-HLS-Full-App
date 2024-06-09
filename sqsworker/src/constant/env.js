import dotenv from "dotenv";
dotenv.config();

export const ENV = {
  AWS_REGION: process.env.AWS_REGION,
  QUEUE_URL: process.env.QUEUE_URL,
  AWS_ACCESS_KEY: process.env.AWS_ACCESS_KEY,
  AWS_SECRET_ACCESS_KEY: process.env.AWS_SECRET_ACCESS_KEY,

  REDIS_URL: process.env.REDIS_URL,
};
