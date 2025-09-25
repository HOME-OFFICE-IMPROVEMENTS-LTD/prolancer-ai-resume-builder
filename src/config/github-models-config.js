/**
 * GitHub Models API Configuration
 * ProLancer AI Resume Builder
 * 
 * This module configures the GitHub Models API integration
 * for AI-powered resume enhancement features.
 */

const GITHUB_MODELS_CONFIG = {
  // API Configuration
  baseURL: 'https://models.inference.ai.azure.com',
  
  // Available Models
  models: {
    primary: 'gpt-4o',           // Best quality, higher cost
    fallback: 'gpt-4o-mini',     // Good quality, lower cost
    alternative: 'claude-3.5-sonnet' // Alternative provider
  },
  
  // API Endpoints
  endpoints: {
    chat: '/chat/completions',
    models: '/models',
    usage: '/usage'
  },
  
  // Rate Limiting
  rateLimit: {
    requestsPerMinute: 50,
    tokensPerRequest: 4000,
    maxRetries: 3,
    retryDelay: 1000 // ms
  },
  
  // Request Configuration
  requestConfig: {
    headers: {
      'Content-Type': 'application/json',
      'Accept': 'application/json'
    },
    timeout: 30000, // 30 seconds
    maxContentLength: 10000000 // 10MB
  },
  
  // Model-specific settings
  modelSettings: {
    'gpt-4o': {
      maxTokens: 4000,
      temperature: 0.7,
      topP: 1,
      frequencyPenalty: 0,
      presencePenalty: 0
    },
    'gpt-4o-mini': {
      maxTokens: 2000,
      temperature: 0.7,
      topP: 1,
      frequencyPenalty: 0,
      presencePenalty: 0
    },
    'claude-3.5-sonnet': {
      maxTokens: 4000,
      temperature: 0.7,
      topP: 0.9
    }
  },
  
  // AI Enhancement Prompts
  prompts: {
    enhanceResume: {
      system: `You are a professional resume enhancement AI. Your goal is to improve resume content while maintaining authenticity and professional standards. 
      
      Guidelines:
      - Enhance clarity and impact
      - Use action verbs and quantifiable achievements
      - Maintain professional tone
      - Ensure ATS compatibility
      - Keep content truthful and verifiable`,
      
      user: `Please enhance the following resume section for professional impact:
      
      Section Type: {sectionType}
      Current Content: {content}
      Target Role: {targetRole}
      
      Provide enhanced content that is:
      1. More impactful and professional
      2. Optimized for ATS systems
      3. Quantified where possible
      4. Tailored to the target role`
    },
    
    generateSuggestions: {
      system: `You are an AI career advisor specializing in resume optimization. Provide specific, actionable suggestions for resume improvement.`,
      
      user: `Based on this resume content and target role, provide 3-5 specific improvement suggestions:
      
      Current Content: {content}
      Target Role: {targetRole}
      
      Format your response as a JSON array of suggestion objects with 'type', 'suggestion', and 'impact' fields.`
    },
    
    analyzeJob: {
      system: `You are an AI job analysis expert. Extract key requirements, skills, and keywords from job descriptions to help optimize resumes.`,
      
      user: `Analyze this job description and extract:
      1. Required skills and qualifications
      2. Important keywords for ATS
      3. Preferred experience levels
      4. Company culture indicators
      
      Job Description: {jobDescription}
      
      Provide response as structured JSON.`
    }
  },
  
  // Error Messages
  errorMessages: {
    apiKeyMissing: 'GitHub API token is required. Please check your environment configuration.',
    rateLimitExceeded: 'API rate limit exceeded. Please wait before making more requests.',
    networkError: 'Network error occurred. Please check your internet connection.',
    invalidResponse: 'Invalid response from AI service. Please try again.',
    tokenLimitExceeded: 'Content too long for AI processing. Please shorten your text.',
    serviceUnavailable: 'AI service is temporarily unavailable. Please try again later.'
  },
  
  // Feature Flags
  features: {
    contentEnhancement: true,
    jobMatching: true,
    skillSuggestions: true,
    grammarCheck: true,
    templateOptimization: true,
    realTimeAnalysis: false // Enable for premium features
  }
};

// Environment-based configuration
const getEnvironmentConfig = () => {
  const isDevelopment = process.env.NODE_ENV === 'development' || 
                       (typeof window !== 'undefined' && window.location.hostname === 'localhost');
  
  return {
    debug: isDevelopment,
    apiKey: isDevelopment ? 
      process.env.GITHUB_TOKEN_DEV || process.env.GITHUB_TOKEN :
      process.env.GITHUB_TOKEN,
    logging: isDevelopment ? 'verbose' : 'error'
  };
};

// Export configuration
export { GITHUB_MODELS_CONFIG, getEnvironmentConfig };

// For Node.js environments
if (typeof module !== 'undefined' && module.exports) {
  module.exports = { GITHUB_MODELS_CONFIG, getEnvironmentConfig };
}