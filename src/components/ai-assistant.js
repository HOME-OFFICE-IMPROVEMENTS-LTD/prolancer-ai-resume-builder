/**
 * ProLancer AI Assistant Module
 * AUTO-GENERATED - Day 2 Implementation
 */

import githubModelsClient from '../utils/github-api-client.js';

export class ProLancerAIAssistant {
    constructor() {
        this.client = githubModelsClient;
        this.initialized = false;
        this.enhancementHistory = [];
    }

    async initialize() {
        const result = await this.client.initialize();
        this.initialized = result.success;
        return result;
    }

    async enhanceResumeSection(sectionType, content, targetRole = null) {
        if (!this.initialized) {
            throw new Error('AI Assistant not initialized');
        }

        const result = await this.client.enhanceContent(content, sectionType, targetRole);
        
        if (result.success) {
            this.enhancementHistory.push({
                timestamp: new Date().toISOString(),
                sectionType,
                originalContent: content,
                enhancedContent: result.enhancedContent,
                tokensUsed: result.tokensUsed
            });
        }

        return result;
    }

    async generateSkillSuggestions(currentSkills, targetRole) {
        const content = `Current skills: ${currentSkills.join(', ')}`;
        return await this.client.generateSuggestions(content, targetRole);
    }

    async optimizeForATS(resumeContent, jobDescription = null) {
        // ATS optimization logic
        const optimization = await this.client.enhanceContent(
            resumeContent, 
            'ats-optimization', 
            jobDescription
        );
        
        return {
            ...optimization,
            atsScore: this.calculateATSScore(optimization.enhancedContent)
        };
    }

    calculateATSScore(content) {
        // Simple ATS scoring algorithm
        const keywords = content.match(/\b[A-Z][a-z]+\b/g) || [];
        const actionVerbs = ['managed', 'led', 'developed', 'implemented', 'achieved'];
        const actionVerbCount = actionVerbs.filter(verb => 
            content.toLowerCase().includes(verb)
        ).length;
        
        return Math.min(100, (keywords.length * 2) + (actionVerbCount * 10));
    }

    getEnhancementStats() {
        return {
            totalEnhancements: this.enhancementHistory.length,
            totalTokensUsed: this.enhancementHistory.reduce((sum, h) => sum + h.tokensUsed, 0),
            sectionTypes: [...new Set(this.enhancementHistory.map(h => h.sectionType))]
        };
    }
}

export default new ProLancerAIAssistant();
