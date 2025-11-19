import { config } from '../config/env.js';
import { logger } from '../utils/logger.js';
import { cacheService } from './cache.service.js';
import { hash } from '../utils/encryption.js';

// Optimized sentiment word sets for O(1) lookup
const POSITIVE_WORDS = new Set(['love', 'great', 'excellent', 'amazing', 'wonderful', 'good', 'happy', 'pleased', 'fantastic', 'awesome', 'brilliant', 'perfect']);
const NEGATIVE_WORDS = new Set(['hate', 'terrible', 'awful', 'bad', 'sad', 'angry', 'disappointed', 'horrible', 'worst', 'hateful', 'disgusting']);

// Mock AI responses for when OpenAI is not configured
class MockAIService {
  constructor() {
    this.DELAY_MS = 300; // Reduced delay for better performance
  }

  async simulateDelay(ms = this.DELAY_MS) {
    return new Promise(resolve => {
      setTimeout(() => resolve(), ms);
    });
  }

  async chatCompletion(messages, model = 'gpt-3.5-turbo') {
    await this.simulateDelay();
    const lastMessage = messages[messages.length - 1]?.content || '';
    const lowerMessage = lastMessage.toLowerCase();

    // Optimized response matching
    if (lowerMessage.includes('hello') || lowerMessage.includes('hi')) {
      return 'Hello! How can I help you today?';
    }
    if (lowerMessage.includes('help')) {
      return 'I\'m here to help! What would you like to know?';
    }
    if (lowerMessage.includes('bye') || lowerMessage.includes('goodbye')) {
      return 'Goodbye! Have a great day!';
    }

    return `I understand you said: "${lastMessage.substring(0, 100)}${lastMessage.length > 100 ? '...' : ''}". This is a mock response. To use real AI, set OPENAI_API_KEY environment variable.`;
  }

  async generateText(prompt, _systemPrompt, model = 'gpt-3.5-turbo') {
    await this.simulateDelay();
    const wordCount = prompt.split(/\s+/).length;
    const preview = prompt.substring(0, 100);
    return `Generated text based on your prompt (${wordCount} words): "${preview}${prompt.length > 100 ? '...' : ''}". This is a mock response. Set OPENAI_API_KEY for real AI generation.`;
  }

  async analyzeSentiment(text) {
    await this.simulateDelay();
    // Optimized sentiment analysis using Set for O(1) lookups
    const words = text.toLowerCase().split(/\W+/);
    let positiveCount = 0;
    let negativeCount = 0;
    
    for (const word of words) {
      if (POSITIVE_WORDS.has(word)) positiveCount++;
      if (NEGATIVE_WORDS.has(word)) negativeCount++;
    }
    
    if (positiveCount > negativeCount) return 'positive';
    if (negativeCount > positiveCount) return 'negative';
    return 'neutral';
  }

  async summarizeText(text, maxLength = 100) {
    await this.simulateDelay();
    const sentences = text.split(/[.!?]+/).filter(s => s.trim().length > 0);
    
    if (sentences.length === 0) {
      const words = text.split(/\s+/);
      const wordCount = Math.min(Math.ceil(maxLength / 10), words.length);
      return words.slice(0, wordCount).join(' ') + '...';
    }
    
    // Take first 30% of sentences, but ensure it fits maxLength
    const targetSentences = Math.max(1, Math.ceil(sentences.length * 0.3));
    const summary = sentences.slice(0, targetSentences).join('. ').trim();
    
    if (summary.length <= maxLength * 1.5) {
      return summary + (summary.endsWith('.') ? '' : '.');
    }
    
    // Fallback: truncate to maxLength
    return summary.substring(0, maxLength).trim() + '...';
  }
}

// OpenAI service (optional)
class OpenAIService {
  constructor(apiKey) {
    this.client = null;
    this.initialized = false;
    this.initPromise = null;
    // Initialize asynchronously
    this.initPromise = this.initializeClient(apiKey);
  }

  async initializeClient(apiKey) {
    try {
      // Dynamic import for optional dependency
      const openaiModule = await import('openai');
      const OpenAI = openaiModule.default;
      this.client = new OpenAI({ apiKey });
      this.initialized = true;
      logger.info('OpenAI client initialized successfully');
    } catch (error) {
      logger.warn('OpenAI package not available. Using mock service instead.', error);
      this.client = null;
      this.initialized = false;
    }
  }

  async ensureInitialized() {
    if (this.initPromise) {
      await this.initPromise;
      this.initPromise = null;
    }
    if (!this.initialized && !this.client) {
      throw new Error('OpenAI client not available');
    }
  }

  async chatCompletion(messages, model = 'gpt-3.5-turbo') {
    await this.ensureInitialized();

    // Check cache first - include model in cache key to avoid cross-model contamination
    const cacheKey = `chat:${model}:${hash(JSON.stringify(messages))}`;
    const cached = cacheService.get(cacheKey);
    if (cached) {
      return cached;
    }

    const response = await this.client.chat.completions.create({
      model: model,
      messages: messages,
      temperature: 0.7,
      max_tokens: 1000,
    });

    const result = response.choices[0]?.message?.content || 'No response generated';

    // Cache the result for 5 minutes
    cacheService.set(cacheKey, result, 5 * 60 * 1000);

    return result;
  }

  async generateText(prompt, systemPrompt, model = 'gpt-3.5-turbo') {
    const messages = [];

    if (systemPrompt) {
      messages.push({ role: 'system', content: systemPrompt });
    }

    messages.push({ role: 'user', content: prompt });

    return this.chatCompletion(messages, model);
  }

  async analyzeSentiment(text) {
    const systemPrompt = 'You are a sentiment analysis expert. Analyze the sentiment of the given text and respond with one word: positive, negative, or neutral.';
    return this.generateText(text, systemPrompt);
  }

  async summarizeText(text, maxLength = 100) {
    const systemPrompt = `You are a text summarization expert. Summarize the given text in approximately ${maxLength} words.`;
    const prompt = `Please summarize the following text:\n\n${text}`;
    return this.generateText(prompt, systemPrompt);
  }
}

// Main AI Service that uses OpenAI if available, otherwise uses mock
class AIService {
  constructor() {
    this.mockFallback = new MockAIService();
    
    if (config.openaiApiKey) {
      this.service = new OpenAIService(config.openaiApiKey);
      this.useOpenAI = true;
      logger.info('Initializing OpenAI service');
    } else {
      this.service = this.mockFallback;
      this.useOpenAI = false;
      logger.info('Using mock AI service (no OpenAI API key configured)');
    }
  }

  async chatCompletion(messages, model = 'gpt-3.5-turbo') {
    try {
      return await this.service.chatCompletion(messages, model);
    } catch (error) {
      // Fallback to mock if OpenAI fails
      if (this.useOpenAI) {
        logger.warn('OpenAI request failed, falling back to mock service', error);
        return this.mockFallback.chatCompletion(messages, model);
      }
      throw error;
    }
  }

  async generateText(prompt, systemPrompt, model = 'gpt-3.5-turbo') {
    try {
      return await this.service.generateText(prompt, systemPrompt, model);
    } catch (error) {
      if (this.useOpenAI) {
        logger.warn('OpenAI request failed, falling back to mock service', error);
        return this.mockFallback.generateText(prompt, systemPrompt, model);
      }
      throw error;
    }
  }

  async analyzeSentiment(text) {
    // Check cache for sentiment analysis
    const cacheKey = `sentiment:${hash(text)}`;
    const cached = cacheService.get(cacheKey);
    if (cached) {
      return cached;
    }

    try {
      const result = await this.service.analyzeSentiment(text);
      cacheService.set(cacheKey, result, 10 * 60 * 1000); // Cache for 10 minutes
      return result;
    } catch (error) {
      if (this.useOpenAI) {
        logger.warn('OpenAI request failed, falling back to mock service', error);
        return this.mockFallback.analyzeSentiment(text);
      }
      throw error;
    }
  }

  async summarizeText(text, maxLength) {
    try {
      return await this.service.summarizeText(text, maxLength);
    } catch (error) {
      if (this.useOpenAI) {
        logger.warn('OpenAI request failed, falling back to mock service', error);
        return this.mockFallback.summarizeText(text, maxLength);
      }
      throw error;
    }
  }
}

export const aiService = new AIService();

