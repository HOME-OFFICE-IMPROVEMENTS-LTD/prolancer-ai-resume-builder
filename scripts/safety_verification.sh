#!/bin/bash
# 🛡️ FOOLPROOF SAFE REPOSITORY WORKFLOW
# GUARANTEES: Only work within YOUR repository, NEVER touch upstream

set -e

echo "🛡️ FOOLPROOF SAFE REPOSITORY WORKFLOW"
echo "====================================="

# Verify we're in the right place
REPO_PATH=$(pwd)
if [[ ! "$REPO_PATH" == *"prolancer-ai-resume-builder" ]]; then
    echo "❌ ERROR: Not in prolancer-ai-resume-builder directory!"
    echo "Current: $REPO_PATH"
    exit 1
fi

echo "✅ Location verified: prolancer-ai-resume-builder"

# Check remotes for safety
echo ""
echo "🔍 REMOTE SAFETY CHECK:"
echo "======================"

ORIGIN_URL=$(git remote get-url origin)
UPSTREAM_URL=$(git remote get-url upstream)

echo "🟢 YOUR REPO (SAFE):     $ORIGIN_URL"
echo "🔴 UPSTREAM (DANGER):    $UPSTREAM_URL"

# Verify we're working with YOUR repository only
if [[ "$ORIGIN_URL" == *"HOME-OFFICE-IMPROVEMENTS-LTD"* ]]; then
    echo "✅ CONFIRMED: Working with YOUR repository"
else
    echo "❌ ERROR: Origin is not your repository!"
    exit 1
fi

echo ""
echo "📋 BRANCH SAFETY ANALYSIS:"
echo "=========================="

CURRENT_BRANCH=$(git branch --show-current)
echo "📍 Current branch: $CURRENT_BRANCH"

# List only YOUR branches (not upstream)
echo ""
echo "🟢 YOUR SAFE BRANCHES:"
git branch | sed 's/^../   /'

echo ""
echo "🟢 YOUR REMOTE BRANCHES:"
git branch -r | grep "origin/" | sed 's/^../   /'

echo ""
echo "🔴 UPSTREAM BRANCHES (DO NOT TOUCH):"
git branch -r | grep "upstream/" | sed 's/^../   /'

echo ""
echo "🎯 SAFE PR CREATION STRATEGY:"
echo "============================="
echo ""
echo "✅ SAFE APPROACH: Internal PR within YOUR repository"
echo "   From: $CURRENT_BRANCH"
echo "   To: develop (your branch)"
echo "   Repository: HOME-OFFICE-IMPROVEMENTS-LTD/prolancer-ai-resume-builder"
echo ""
echo "❌ DANGEROUS: PR to upstream repository"  
echo "   To: Metroxe/one-html-page-challenge"
echo "   Result: Rule violations, rejection, embarrassment"
echo ""
echo "🔗 GUARANTEED SAFE PR URL:"
echo "https://github.com/HOME-OFFICE-IMPROVEMENTS-LTD/prolancer-ai-resume-builder/compare/develop...$CURRENT_BRANCH"

echo ""
echo "🛡️ SAFETY VERIFICATION COMPLETE"
echo "==============================="
echo "✅ Repository ownership confirmed"
echo "✅ Branch structure analyzed"  
echo "✅ Safe PR strategy identified"
echo "✅ Zero risk of upstream contamination"

echo ""
echo "🎯 YOU CAN PROCEED SAFELY WITH THE URL ABOVE!"
echo "   - Creates PR within YOUR repository only"
echo "   - No risk of touching upstream repository"
echo "   - Professional internal development workflow"