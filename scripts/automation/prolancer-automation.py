#!/usr/bin/env python3
"""
ProLancer AI Development Automation Script
Eliminates human errors in repetitive development tasks

This script automates the most error-prone steps from our development roadmap:
- File structure creation
- Code scaffolding with templates  
- Environment setup
- Git workflow automation
- Testing automation
- Validation checks
"""

import os
import sys
import json
import subprocess
from pathlib import Path
from datetime import datetime
import argparse

class ProLancerAutomation:
    def __init__(self, project_root="/home/msalsouri/Projects/prolancer-ai-resume-builder"):
        self.project_root = Path(project_root)
        self.current_day = self.detect_current_day()
        self.log_file = self.project_root / "automation.log"
        
    def detect_current_day(self):
        """Auto-detect which development day we're on"""
        src_path = self.project_root / "src"
        
        if not (src_path / "config").exists():
            return 1  # Day 1: API Setup
        elif not (src_path / "components").exists():
            return 2  # Day 2: Core AI Features
        elif not (src_path / "assets" / "styles").exists():
            return 3  # Day 3: UI Integration
        elif not (src_path / "tests").exists():
            return 4  # Day 4: Advanced Features
        else:
            return 5  # Day 5: Testing & Refinement

    def log(self, message, level="INFO"):
        """Centralized logging"""
        timestamp = datetime.now().isoformat()
        log_entry = f"[{timestamp}] [{level}] {message}"
        print(log_entry)
        
        with open(self.log_file, "a") as f:
            f.write(log_entry + "\n")

    def run_command(self, cmd, cwd=None, check=True):
        """Safe command execution with error handling"""
        try:
            cwd = cwd or self.project_root
            self.log(f"Running: {cmd} (in {cwd})")
            
            result = subprocess.run(
                cmd, shell=True, cwd=cwd, 
                capture_output=True, text=True, check=check
            )
            
            if result.stdout:
                self.log(f"Output: {result.stdout.strip()}")
            return result
        except subprocess.CalledProcessError as e:
            self.log(f"Command failed: {e.stderr}", "ERROR")
            raise

    def create_directory_structure(self):
        """AUTO: Create complete directory structure"""
        self.log("🏗️  Creating directory structure...")
        
        directories = [
            "src/components",
            "src/utils", 
            "src/config",
            "src/assets/styles",
            "src/assets/icons",
            "src/assets/templates",
            "src/tests",
            "scripts/automation",
            "docs/api",
            "docs/components",
            ".vscode"
        ]
        
        for dir_path in directories:
            full_path = self.project_root / dir_path
            full_path.mkdir(parents=True, exist_ok=True)
            self.log(f"✅ Created: {dir_path}")

    def generate_day2_ai_assistant(self):
        """AUTO: Generate AI Assistant module"""
        self.log("🤖 Generating AI Assistant module...")
        
        ai_assistant_code = '''/**
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
        const keywords = content.match(/\\b[A-Z][a-z]+\\b/g) || [];
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
'''

        ai_assistant_file = self.project_root / "src/components/ai-assistant.js"
        with open(ai_assistant_file, "w") as f:
            f.write(ai_assistant_code)
        
        self.log("✅ AI Assistant module generated")

    def generate_day3_ui_components(self):
        """AUTO: Generate UI integration components"""
        self.log("🎨 Generating UI components...")
        
        ui_enhancer_code = '''/**
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
'''

        ui_file = self.project_root / "src/components/ui-enhancement-manager.js"
        with open(ui_file, "w") as f:
            f.write(ui_enhancer_code)
        
        self.log("✅ UI components generated")

    def generate_css_styles(self):
        """AUTO: Generate CSS styles for AI components"""
        self.log("🎨 Generating CSS styles...")
        
        css_content = '''/* ProLancer AI Enhancement Styles - AUTO-GENERATED */

.ai-enhance-btn {
    background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
    color: white;
    border: none;
    padding: 8px 16px;
    border-radius: 6px;
    cursor: pointer;
    font-size: 14px;
    margin-left: 10px;
    transition: all 0.3s ease;
}

.ai-enhance-btn:hover {
    transform: translateY(-2px);
    box-shadow: 0 4px 12px rgba(102, 126, 234, 0.4);
}

.ai-enhance-btn:disabled {
    opacity: 0.6;
    cursor: not-allowed;
    transform: none;
}

.enhancement-modal {
    position: fixed;
    top: 0;
    left: 0;
    width: 100%;
    height: 100%;
    background: rgba(0, 0, 0, 0.5);
    display: flex;
    justify-content: center;
    align-items: center;
    z-index: 1000;
}

.modal-content {
    background: white;
    padding: 30px;
    border-radius: 12px;
    max-width: 80%;
    max-height: 80%;
    overflow-y: auto;
}

.comparison {
    display: grid;
    grid-template-columns: 1fr 1fr;
    gap: 20px;
    margin: 20px 0;
}

.before, .after {
    padding: 15px;
    border-radius: 8px;
}

.before {
    background: #fff3cd;
    border-left: 4px solid #ffc107;
}

.after {
    background: #d4edda;
    border-left: 4px solid #28a745;
}

.modal-actions {
    display: flex;
    justify-content: flex-end;
    gap: 10px;
    margin-top: 20px;
}

.modal-actions button {
    padding: 10px 20px;
    border: none;
    border-radius: 6px;
    cursor: pointer;
}

.modal-actions button:first-child {
    background: #6c757d;
    color: white;
}

.modal-actions button:last-child {
    background: #28a745;
    color: white;
}

.ai-error {
    position: fixed;
    top: 20px;
    right: 20px;
    background: #dc3545;
    color: white;
    padding: 15px;
    border-radius: 8px;
    z-index: 1001;
    animation: slideIn 0.3s ease;
}

@keyframes slideIn {
    from { transform: translateX(100%); }
    to { transform: translateX(0); }
}

/* Loading states */
.ai-enhance-btn:disabled::after {
    content: "";
    display: inline-block;
    width: 12px;
    height: 12px;
    margin-left: 8px;
    border: 2px solid #ffffff;
    border-radius: 50%;
    border-top-color: transparent;
    animation: spin 1s ease-in-out infinite;
}

@keyframes spin {
    to { transform: rotate(360deg); }
}
'''

        css_file = self.project_root / "src/assets/styles/ai-components.css"
        with open(css_file, "w") as f:
            f.write(css_content)
        
        self.log("✅ CSS styles generated")

    def generate_test_suite(self):
        """AUTO: Generate comprehensive test suite"""
        self.log("🧪 Generating test suite...")
        
        test_code = '''/**
 * ProLancer AI Test Suite - AUTO-GENERATED
 */

// Mock GitHub API for testing
const mockAPI = {
    enhanceContent: jest.fn(),
    generateSuggestions: jest.fn(),
    analyzeJobDescription: jest.fn()
};

describe('ProLancer AI Assistant', () => {
    let aiAssistant;
    
    beforeEach(() => {
        // Reset mocks
        jest.clearAllMocks();
        aiAssistant = new ProLancerAIAssistant();
    });

    test('should initialize successfully', async () => {
        mockAPI.initialize = jest.fn().mockResolvedValue({ success: true });
        const result = await aiAssistant.initialize();
        expect(result.success).toBe(true);
    });

    test('should enhance resume content', async () => {
        const mockResponse = {
            success: true,
            enhancedContent: 'Enhanced content',
            tokensUsed: 150
        };
        
        mockAPI.enhanceContent.mockResolvedValue(mockResponse);
        aiAssistant.client = mockAPI;
        aiAssistant.initialized = true;
        
        const result = await aiAssistant.enhanceResumeSection(
            'experience', 
            'Original content'
        );
        
        expect(result.success).toBe(true);
        expect(result.enhancedContent).toBe('Enhanced content');
    });

    test('should calculate ATS score correctly', () => {
        const content = 'Managed team of developers and led project implementation';
        const score = aiAssistant.calculateATSScore(content);
        expect(score).toBeGreaterThan(0);
    });

    test('should track enhancement history', async () => {
        aiAssistant.initialized = true;
        aiAssistant.client = {
            enhanceContent: jest.fn().mockResolvedValue({
                success: true,
                enhancedContent: 'Enhanced',
                tokensUsed: 100
            })
        };
        
        await aiAssistant.enhanceResumeSection('skills', 'JavaScript');
        
        const stats = aiAssistant.getEnhancementStats();
        expect(stats.totalEnhancements).toBe(1);
        expect(stats.totalTokensUsed).toBe(100);
    });
});

// Integration tests
describe('UI Enhancement Integration', () => {
    let uiManager;
    
    beforeEach(() => {
        document.body.innerHTML = '';
        uiManager = new UIEnhancementManager();
    });

    test('should create enhance button', () => {
        const button = uiManager.createEnhanceButton('test-section', 'experience');
        expect(button.tagName).toBe('BUTTON');
        expect(button.textContent).toContain('Enhance with AI');
    });

    test('should handle loading states', () => {
        const button = uiManager.createEnhanceButton('test-section', 'skills');
        uiManager.setLoadingState('test-section', true);
        
        expect(button.textContent).toContain('Enhancing');
        expect(button.disabled).toBe(true);
    });
});
'''

        test_file = self.project_root / "src/tests/ai-features.test.js"
        with open(test_file, "w") as f:
            f.write(test_code)
        
        self.log("✅ Test suite generated")

    def setup_package_json(self):
        """AUTO: Setup package.json with all dependencies"""
        self.log("📦 Setting up package.json...")
        
        package_json = {
            "name": "prolancer-ai-resume-builder",
            "version": "1.0.0",
            "description": "AI-Enhanced Interactive Resume Builder",
            "main": "entries/interactiveResumeBuilder.html",
            "scripts": {
                "dev": "live-server --port=3000 --open=entries/",
                "test": "jest",
                "test:watch": "jest --watch",
                "build": "npm run validate && npm run format",
                "validate": "html-validate entries/interactiveResumeBuilder.html",
                "format": "prettier --write src/**/*.{html,css,js}",
                "lint": "eslint src/**/*.js",
                "auto-dev": "python3 scripts/automation/prolancer-automation.py --day=auto",
                "setup": "npm install && python3 scripts/automation/prolancer-automation.py --setup"
            },
            "devDependencies": {
                "jest": "^29.0.0",
                "prettier": "^3.0.0",
                "eslint": "^8.0.0",
                "html-validate": "^8.0.0",
                "live-server": "^1.2.2"
            },
            "jest": {
                "testEnvironment": "jsdom",
                "setupFilesAfterEnv": ["<rootDir>/src/tests/setup.js"]
            },
            "keywords": ["AI", "Resume", "Builder", "GitHub-Models", "ProLancer"],
            "author": "HOME-OFFICE-IMPROVEMENTS-LTD",
            "license": "MIT"
        }
        
        package_file = self.project_root / "package.json"
        with open(package_file, "w") as f:
            json.dump(package_json, f, indent=2)
        
        self.log("✅ package.json created")

    def create_automation_scripts(self):
        """AUTO: Create additional automation helpers"""
        self.log("🤖 Creating automation helpers...")
        
        # Git automation script
        git_auto = '''#!/bin/bash
# Git Workflow Automation - AUTO-GENERATED

set -e

DAY=$(python3 -c "from pathlib import Path; import sys; sys.path.append('scripts/automation'); from prolancer_automation import ProLancerAutomation; print(ProLancerAutomation().detect_current_day())")

echo "🤖 Auto-detected: Day $DAY development"

# Auto commit with meaningful messages
case $DAY in
    1)
        git add . && git commit -m "feat: Complete Day 1 - GitHub Models API setup" || echo "Nothing to commit"
        ;;
    2)
        git add . && git commit -m "feat: Complete Day 2 - AI Assistant core features" || echo "Nothing to commit"
        ;;
    3)
        git add . && git commit -m "feat: Complete Day 3 - UI integration components" || echo "Nothing to commit"
        ;;
    4)
        git add . && git commit -m "feat: Complete Day 4 - Advanced AI features" || echo "Nothing to commit"
        ;;
    5)
        git add . && git commit -m "feat: Complete Day 5 - Testing and refinement" || echo "Nothing to commit"
        ;;
esac

echo "✅ Git automation complete"
'''

        git_script = self.project_root / "scripts/automation/git-auto.sh"
        git_script.parent.mkdir(parents=True, exist_ok=True)
        with open(git_script, "w") as f:
            f.write(git_auto)
        git_script.chmod(0o755)
        
        self.log("✅ Git automation script created")

    def run_day_automation(self, day=None):
        """Execute automation for specific day"""
        day = day or self.current_day
        self.log(f"🚀 Running Day {day} automation...")
        
        if day >= 1:
            self.create_directory_structure()
            
        if day >= 2:
            self.generate_day2_ai_assistant()
            
        if day >= 3:
            self.generate_day3_ui_components()
            self.generate_css_styles()
            
        if day >= 4:
            self.generate_test_suite()
            
        if day >= 5:
            self.setup_package_json()
            
        self.create_automation_scripts()
        self.log(f"✅ Day {day} automation complete!")

    def validate_setup(self):
        """AUTO: Validate everything is working"""
        self.log("🔍 Validating setup...")
        
        checks = [
            ("Git status", "git status --porcelain"),
            ("Node.js available", "node --version"),
            ("Python available", "python3 --version"),
            ("Directory structure", f"find {self.project_root}/src -type d")
        ]
        
        for name, cmd in checks:
            try:
                result = self.run_command(cmd, check=False)
                if result.returncode == 0:
                    self.log(f"✅ {name}: OK")
                else:
                    self.log(f"⚠️  {name}: Warning", "WARN")
            except Exception as e:
                self.log(f"❌ {name}: {e}", "ERROR")

def main():
    parser = argparse.ArgumentParser(description="ProLancer Development Automation")
    parser.add_argument("--day", type=str, default="auto", 
                       help="Day to automate (1-5) or 'auto' to detect")
    parser.add_argument("--setup", action="store_true", 
                       help="Run initial setup")
    parser.add_argument("--validate", action="store_true", 
                       help="Validate current setup")
    
    args = parser.parse_args()
    
    automation = ProLancerAutomation()
    
    if args.setup or args.validate:
        automation.validate_setup()
        
    if args.day == "auto":
        day = automation.detect_current_day()
    else:
        day = int(args.day)
    
    automation.run_day_automation(day)
    print(f"\n🎉 Day {day} automation complete! Check automation.log for details.")

if __name__ == "__main__":
    main()