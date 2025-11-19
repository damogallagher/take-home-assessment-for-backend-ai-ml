import { aiService } from '../services/ai.service.js';
import { sendSuccess } from '../utils/response.js';
import { validate } from '../utils/validation.js';
import { z } from 'zod';
import { asyncHandler } from '../middleware/asyncHandler.js';
import { logger } from '../utils/logger.js';
import { AI_MODELS } from '../constants/index.js';

const chatSchema = z.object({
  messages: z.array(z.object({
    role: z.enum(['user', 'assistant', 'system']),
    content: z.string().min(1).max(10000),
  })).min(1).max(50),
  model: z.enum([AI_MODELS.GPT_3_5_TURBO, AI_MODELS.GPT_4, AI_MODELS.GPT_4_TURBO]).default(AI_MODELS.GPT_3_5_TURBO),
  temperature: z.number().min(0).max(2).optional(),
  maxTokens: z.number().int().positive().optional(),
});

const textSchema = z.object({
  prompt: z.string().min(1).max(10000),
  systemPrompt: z.string().max(1000).optional(),
  model: z.enum([AI_MODELS.GPT_3_5_TURBO, AI_MODELS.GPT_4, AI_MODELS.GPT_4_TURBO]).default(AI_MODELS.GPT_3_5_TURBO),
  temperature: z.number().min(0).max(2).optional(),
  maxTokens: z.number().int().positive().optional(),
});

const sentimentSchema = z.object({
  text: z.string().min(1).max(5000),
});

const summarizeSchema = z.object({
  text: z.string().min(1).max(50000),
  maxLength: z.number().int().positive().max(1000).optional(),
});

export const aiController = {
  chat: asyncHandler(async (req, res) => {
    const data = validate(chatSchema, req.body);
    logger.debug('Chat request received', { messageCount: data.messages.length, model: data.model });
    const response = await aiService.chatCompletion(data.messages, data.model);
    sendSuccess(res, { response }, 'Chat completion successful');
  }),

  generate: asyncHandler(async (req, res) => {
    const data = validate(textSchema, req.body);
    logger.debug('Text generation request received', { promptLength: data.prompt.length, model: data.model });
    const response = await aiService.generateText(data.prompt, data.systemPrompt, data.model);
    sendSuccess(res, { response }, 'Text generated successfully');
  }),

  sentiment: asyncHandler(async (req, res) => {
    const data = validate(sentimentSchema, req.body);
    logger.debug('Sentiment analysis request received', { textLength: data.text.length });
    const sentiment = await aiService.analyzeSentiment(data.text);
    sendSuccess(res, { 
      sentiment: sentiment.trim().toLowerCase()
    }, 'Sentiment analyzed successfully');
  }),

  summarize: asyncHandler(async (req, res) => {
    const data = validate(summarizeSchema, req.body);
    logger.debug('Summarization request received', { 
      textLength: data.text.length,
      maxLength: data.maxLength 
    });
    const summary = await aiService.summarizeText(data.text, data.maxLength);
    sendSuccess(res, { 
      summary,
      originalLength: data.text.length,
      summaryLength: summary.length
    }, 'Text summarized successfully');
  }),
};
