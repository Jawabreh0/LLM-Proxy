export const config = {
  openaiApiKey: process.env.OPENAI_API_KEY || "",
  bedrockRegion: process.env.AWS_REGION || "eu-west-2",
  awsAccessKey: process.env.AWS_ACCESS_KEY_ID || "",
  awsSecretKey: process.env.AWS_SECRET_ACCESS_KEY || "",
};
console.log(config);
