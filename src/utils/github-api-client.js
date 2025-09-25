/**
 * GitHub Models API Client
 * ProLancer AI Resume Builder
 * 
 * This module provides a secure, rate-limited client for interacting
 * with the GitHub Models API for AI-powered resume enhancements.
 */

import { GITHUB_MODELS_CONFIG, getEnvironmentConfig } from '../config/github-models-config.js';

class GitHubModelsAPIClient {
  constructor() {
    this.config = GITHUB_MODELS_CONFIG;
    this.env = getEnvironmentConfig();
    this.requestQueue = [];
    this.rateLimiter = new RateLimiter(this.config.rateLimit);
    this.initialized = false;
    
    // Bind methods to maintain context
    this.makeRequest = this.makeRequest.bind(this);
    this.enhanceContent = this.enhanceContent.bind(this);
    this.generateSuggestions = this.generateSuggestions.bind(this);
  }

  /**
   * Initialize the API client
   */
  async initialize() {
    try {
      // Check API key availability
      if (!this.env.apiKey) {
        throw new Error(this.config.errorMessages.apiKeyMissing);
      }

      // Test API connectivity
      await this.testConnection();
      
      this.initialized = true;
      this.log('API client initialized successfully', 'info');
      
      return { success: true, message: 'GitHub Models API client ready' };
    } catch (error) {
      this.log(`Initialization failed: ${error.message}`, 'error');
      return { success: false, error: error.message };
    }
  }

  /**
   * Test API connection
   */
  async testConnection() {
    try {
      const response = await fetch(`${this.config.baseURL}${this.config.endpoints.models}`, {
        method: 'GET',
        headers: {
          'Authorization': `Bearer ${this.env.apiKey}`,
          ...this.config.requestConfig.headers
        },
        signal: AbortSignal.timeout(this.config.requestConfig.timeout)
      });

      if (!response.ok) {
        throw new Error(`API test failed: ${response.status} ${response.statusText}`);
      }

      const data = await response.json();
      this.log(`API connection test successful. Available models: ${data.data?.length || 0}`, 'info');
      
      return data;
    } catch (error) {
      if (error.name === 'TimeoutError') {
        throw new Error(this.config.errorMessages.networkError);
      }
      throw error;
    }
  }

  /**
   * Make a rate-limited API request
   */
  async makeRequest(endpoint, payload, model = this.config.models.primary) {
    if (!this.initialized) {
      const initResult = await this.initialize();
      if (!initResult.success) {
        throw new Error(initResult.error);
      }
    }

    // Wait for rate limiting
    await this.rateLimiter.waitForSlot();

    try {
      const requestBody = {
        model: model,
        messages: payload.messages,
        ...this.config.modelSettings[model]
      };

      this.log(`Making request to ${endpoint} with model ${model}`, 'debug');

      const response = await fetch(`${this.config.baseURL}${endpoint}`, {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${this.env.apiKey}`,
          ...this.config.requestConfig.headers
        },
        body: JSON.stringify(requestBody),
        signal: AbortSignal.timeout(this.config.requestConfig.timeout)
      });

      if (!response.ok) {
        await this.handleAPIError(response);
      }

      const data = await response.json();
      this.rateLimiter.recordSuccess();
      
      this.log(`Request successful. Tokens used: ${data.usage?.total_tokens || 'unknown'}`, 'debug');
      
      return data;
    } catch (error) {
      this.rateLimiter.recordError();
      await this.handleRequestError(error, model);
      throw error;
    }
  }

  /**
   * Enhance resume content using AI
   */
  async enhanceContent(content, sectionType = 'general', targetRole = null) {
    try {
      if (!content || content.trim().length === 0) {
        throw new Error('Content is required for enhancement');
      }

      if (content.length > this.config.rateLimit.tokensPerRequest * 3) {
        throw new Error(this.config.errorMessages.tokenLimitExceeded);
      }

      const prompt = this.config.prompts.enhanceResume.user
        .replace('{sectionType}', sectionType)
        .replace('{content}', content)
        .replace('{targetRole}', targetRole || 'general position');

      const payload = {
        messages: [
          { role: 'system', content: this.config.prompts.enhanceResume.system },
          { role: 'user', content: prompt }
        ]
      };

      const response = await this.makeRequest(this.config.endpoints.chat, payload);
      
      return {
        success: true,
        enhancedContent: response.choices[0].message.content,
        originalContent: content,
        tokensUsed: response.usage?.total_tokens || 0,
        model: response.model
      };
    } catch (error) {
      this.log(`Content enhancement failed: ${error.message}`, 'error');
      return {
        success: false,
        error: error.message,
        originalContent: content
      };
    }
  }

  /**
   * Generate improvement suggestions
   */
  async generateSuggestions(content, targetRole = null) {
    try {
      const prompt = this.config.prompts.generateSuggestions.user
        .replace('{content}', content)
        .replace('{targetRole}', targetRole || 'general position');

      const payload = {
        messages: [
          { role: 'system', content: this.config.prompts.generateSuggestions.system },
          { role: 'user', content: prompt }
        ]
      };

      const response = await this.makeRequest(this.config.endpoints.chat, payload);
      
      let suggestions;
      try {
        suggestions = JSON.parse(response.choices[0].message.content);
      } catch (parseError) {
        // Fallback: extract suggestions from text response
        suggestions = this.extractSuggestionsFromText(response.choices[0].message.content);
      }

      return {
        success: true,
        suggestions: suggestions,
        tokensUsed: response.usage?.total_tokens || 0
      };
    } catch (error) {
      return {
        success: false,
        error: error.message,
        suggestions: []
      };
    }
  }

  /**
   * Analyze job description
   */
  async analyzeJobDescription(jobDescription) {
    try {
      const prompt = this.config.prompts.analyzeJob.user
        .replace('{jobDescription}', jobDescription);

      const payload = {
        messages: [
          { role: 'system', content: this.config.prompts.analyzeJob.system },
          { role: 'user', content: prompt }
        ]
      };

      const response = await this.makeRequest(this.config.endpoints.chat, payload);
      
      let analysis;
      try {
        analysis = JSON.parse(response.choices[0].message.content);
      } catch (parseError) {
        analysis = { error: 'Failed to parse job analysis', rawResponse: response.choices[0].message.content };
      }

      return {
        success: true,
        analysis: analysis,
        tokensUsed: response.usage?.total_tokens || 0
      };
    } catch (error) {
      return {
        success: false,
        error: error.message
      };
    }
  }

  /**
   * Handle API errors
   */
  async handleAPIError(response) {
    const errorData = await response.json().catch(() => ({ error: 'Unknown error' }));
    
    switch (response.status) {
      case 401:
        throw new Error('Invalid API key. Please check your GitHub token.');
      case 429:
        throw new Error(this.config.errorMessages.rateLimitExceeded);
      case 503:
        throw new Error(this.config.errorMessages.serviceUnavailable);
      default:
        throw new Error(`API Error ${response.status}: ${errorData.error?.message || errorData.error || 'Unknown error'}`);
    }
  }

  /**
   * Handle request errors with fallback
   */
  async handleRequestError(error, currentModel) {
    if (error.name === 'TimeoutError') {
      throw new Error(this.config.errorMessages.networkError);
    }

    // Try fallback model if primary model fails
    if (currentModel === this.config.models.primary && this.config.rateLimit.maxRetries > 0) {
      this.log(`Primary model failed, trying fallback: ${error.message}`, 'warn');
      // This would need to be handled by the calling function
    }

    throw error;
  }

  /**
   * Extract suggestions from text response (fallback)
   */
  extractSuggestionsFromText(text) {
    const lines = text.split('\n').filter(line => line.trim());
    return lines.map((line, index) => ({
      type: 'improvement',
      suggestion: line.replace(/^\d+\.\s*/, '').replace(/^[-*]\s*/, ''),
      impact: 'medium'
    })).slice(0, 5); // Max 5 suggestions
  }

  /**
   * Logging utility
   */
  log(message, level = 'info') {
    if (!this.env.debug && level === 'debug') return;
    
    const timestamp = new Date().toISOString();
    const logMessage = `[${timestamp}] [GitHubModelsAPI] [${level.toUpperCase()}] ${message}`;
    
    switch (level) {
      case 'error':
        console.error(logMessage);
        break;
      case 'warn':
        console.warn(logMessage);
        break;
      case 'debug':
        console.debug(logMessage);
        break;
      default:
        console.log(logMessage);
    }
  }

  /**
   * Get API status and usage info
   */
  getStatus() {
    return {
      initialized: this.initialized,
      rateLimiter: this.rateLimiter.getStatus(),
      config: {
        baseURL: this.config.baseURL,
        primaryModel: this.config.models.primary,
        features: this.config.features
      }
    };
  }
}

/**
 * Rate Limiter Class
 */
class RateLimiter {
  constructor(config) {
    this.requestsPerMinute = config.requestsPerMinute;
    this.maxRetries = config.maxRetries;
    this.retryDelay = config.retryDelay;
    this.requests = [];
    this.errors = 0;
  }

  async waitForSlot() {
    const now = Date.now();
    const oneMinuteAgo = now - 60000;
    
    // Clean old requests
    this.requests = this.requests.filter(time => time > oneMinuteAgo);
    
    // Check if we need to wait
    if (this.requests.length >= this.requestsPerMinute) {
      const oldestRequest = Math.min(...this.requests);
      const waitTime = oldestRequest + 60000 - now + 100; // Add 100ms buffer
      
      if (waitTime > 0) {
        await new Promise(resolve => setTimeout(resolve, waitTime));
        return this.waitForSlot(); // Recursive check
      }
    }
    
    // Record this request
    this.requests.push(now);
  }

  recordSuccess() {
    this.errors = 0; // Reset error count on success
  }

  recordError() {
    this.errors++;
  }

  getStatus() {
    const now = Date.now();
    const oneMinuteAgo = now - 60000;
    const recentRequests = this.requests.filter(time => time > oneMinuteAgo).length;
    
    return {
      requestsInLastMinute: recentRequests,
      slotsAvailable: this.requestsPerMinute - recentRequests,
      recentErrors: this.errors,
      rateLimited: recentRequests >= this.requestsPerMinute
    };
  }
}

// Create and export singleton instance
const githubModelsClient = new GitHubModelsAPIClient();

export default githubModelsClient;

// For Node.js environments
if (typeof module !== 'undefined' && module.exports) {
  module.exports = githubModelsClient;
}