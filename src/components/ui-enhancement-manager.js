/**
 * UI Enhancement Components
 * AUTO-GENERATED - Day 3 Implementation
 */

export class UIEnhancementManager {
    constructor() {
        this.enhanceButtons = new Map();
        this.loadingStates = new Map();
    }

    createEnhanceButton(sectionId, sectionType) {
        const button = document.createElement('button');
        button.className = 'ai-enhance-btn';
        button.innerHTML = '✨ Enhance with AI';
        button.dataset.section = sectionId;
        button.dataset.type = sectionType;
        
        button.addEventListener('click', (e) => this.handleEnhancement(e));
        
        this.enhanceButtons.set(sectionId, button);
        return button;
    }

    async handleEnhancement(event) {
        const button = event.target;
        const sectionId = button.dataset.section;
        const sectionType = button.dataset.type;
        
        this.setLoadingState(sectionId, true);
        
        try {
            const content = this.extractSectionContent(sectionId);
            const result = await window.aiAssistant.enhanceResumeSection(
                sectionType, content
            );
            
            if (result.success) {
                this.showEnhancementModal(result.originalContent, result.enhancedContent);
            } else {
                this.showError(result.error);
            }
        } catch (error) {
            this.showError(error.message);
        } finally {
            this.setLoadingState(sectionId, false);
        }
    }

    extractSectionContent(sectionId) {
        const section = document.getElementById(sectionId);
        return section ? section.textContent.trim() : '';
    }

    setLoadingState(sectionId, loading) {
        const button = this.enhanceButtons.get(sectionId);
        if (button) {
            if (loading) {
                button.innerHTML = '⏳ Enhancing...';
                button.disabled = true;
            } else {
                button.innerHTML = '✨ Enhance with AI';
                button.disabled = false;
            }
        }
    }

    showEnhancementModal(original, enhanced) {
        // Create modal for before/after comparison
        const modal = document.createElement('div');
        modal.className = 'enhancement-modal';
        modal.innerHTML = `
            <div class="modal-content">
                <h3>AI Enhancement Preview</h3>
                <div class="comparison">
                    <div class="before">
                        <h4>Before:</h4>
                        <p>${original}</p>
                    </div>
                    <div class="after">
                        <h4>After:</h4>
                        <p>${enhanced}</p>
                    </div>
                </div>
                <div class="modal-actions">
                    <button onclick="this.parentElement.parentElement.parentElement.remove()">Cancel</button>
                    <button onclick="this.acceptEnhancement('${enhanced}')">Accept</button>
                </div>
            </div>
        `;
        
        document.body.appendChild(modal);
    }

    showError(message) {
        const errorDiv = document.createElement('div');
        errorDiv.className = 'ai-error';
        errorDiv.textContent = `AI Enhancement Error: ${message}`;
        document.body.appendChild(errorDiv);
        
        setTimeout(() => errorDiv.remove(), 5000);
    }
}

export default new UIEnhancementManager();
