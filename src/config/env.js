import dotenv from 'dotenv';

dotenv.config();

export const config = {
  port: parseInt(process.env.PORT || '3000', 10),
  openaiApiKey: process.env.OPENAI_API_KEY || '', // Optional - mock service will be used if not set
  nodeEnv: process.env.NODE_ENV || 'development',
};

