import Redis from "ioredis";

const redis = new Redis(process.env.REDIS_URL!);

export const markVideoAsUploading = async (key: string) => {
  await redis.set(`video:${key}:status`, "uploading");
};

export const markVideoAsUploaded = async (key: string) => {
  await redis.set(`video:${key}:status`, "uploaded");
};

export const getVideoStatus = async (key: string) => {
  return await redis.get(`video:${key}:status`);
};

export const getAllVideosStatus = async () => {
  const fetchSize = 10;
  let cursor = "0";
  let results = [];

  // do {
  const reply = await redis.scan(
    cursor,
    "MATCH",
    "video:*:status",
    "COUNT",
    fetchSize,
  );
  cursor = reply[0];
  const keys = reply[1];
  for (let key of keys) {
    const status = await redis.get(key);
    results.push({ key, status });
  }
  // } while (cursor !== "0");

  return results;
};
