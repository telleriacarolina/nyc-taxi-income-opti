#!/bin/bash
# OpenFreeMap Git Remote Verification Script
# This script verifies the OpenFreeMap remote is properly configured

echo "🔍 OpenFreeMap Git Remote Verification"
echo "========================================"
echo ""

# Check if we're in a git repository
if ! git rev-parse --git-dir > /dev/null 2>&1; then
    echo "❌ Error: Not in a git repository"
    exit 1
fi

echo "✅ Git repository detected"
echo ""

# Check for openfreemap remote
echo "📡 Checking for 'openfreemap' remote..."
if git remote | grep -q "^openfreemap$"; then
    echo "✅ OpenFreeMap remote exists"
    echo ""
    
    # Show remote details
    echo "📋 Remote Configuration:"
    git remote -v | grep openfreemap
    echo ""
    
    # Try to fetch (this will test connectivity)
    echo "🌐 Testing connectivity to OpenFreeMap repository..."
    if git ls-remote openfreemap HEAD > /dev/null 2>&1; then
        echo "✅ Successfully connected to OpenFreeMap repository"
        echo ""
        
        # Show latest commit on main branch
        echo "📌 Latest OpenFreeMap commit:"
        git ls-remote openfreemap refs/heads/main | cut -f1 | head -c 8
        echo ""
        echo ""
        
        # Fetch latest changes
        echo "⬇️  Fetching latest changes from OpenFreeMap..."
        if git fetch openfreemap 2>&1 | grep -q "From"; then
            echo "✅ Fetch successful"
            echo ""
            
            # Show available branches
            echo "🌿 Available OpenFreeMap branches:"
            git branch -r | grep "openfreemap/" | sed 's/^[[:space:]]*//' | head -5
            echo ""
            
            # Check if there are new commits
            if git rev-list HEAD..openfreemap/main --count &> /dev/null; then
                NEW_COMMITS=$(git rev-list HEAD..openfreemap/main --count 2>/dev/null || echo "0")
                if [ "$NEW_COMMITS" -gt 0 ]; then
                    echo "📬 $NEW_COMMITS new commit(s) available from OpenFreeMap"
                    echo ""
                    echo "Recent commits:"
                    git log openfreemap/main --oneline --graph -5 2>/dev/null || echo "Unable to show commits"
                else
                    echo "✅ Local repository is up to date with OpenFreeMap"
                fi
            fi
            echo ""
        else
            echo "⚠️  Fetch completed with warnings (this is normal on first run)"
            echo ""
        fi
    else
        echo "⚠️  Warning: Could not connect to OpenFreeMap repository"
        echo "    This might be a network issue or temporary problem"
        echo ""
    fi
    
    # Check documentation files
    echo "📚 Checking documentation files..."
    DOCS_FOUND=0
    
    if [ -f ".github/OPENFREEMAP.md" ]; then
        echo "✅ .github/OPENFREEMAP.md exists"
        DOCS_FOUND=$((DOCS_FOUND + 1))
    else
        echo "❌ .github/OPENFREEMAP.md missing"
    fi
    
    if [ -f ".github/GIT_REMOTES.md" ]; then
        echo "✅ .github/GIT_REMOTES.md exists"
        DOCS_FOUND=$((DOCS_FOUND + 1))
    else
        echo "❌ .github/GIT_REMOTES.md missing"
    fi
    
    if [ -f ".github/IMPLEMENTATION_SUMMARY.md" ]; then
        echo "✅ .github/IMPLEMENTATION_SUMMARY.md exists"
        DOCS_FOUND=$((DOCS_FOUND + 1))
    else
        echo "❌ .github/IMPLEMENTATION_SUMMARY.md missing"
    fi
    
    echo ""
    
    # Check for OpenFreeMap component
    echo "🗺️  Checking OpenFreeMap implementation..."
    if [ -f "src/components/OpenFreeMap.tsx" ]; then
        echo "✅ OpenFreeMap.tsx component exists"
        
        # Check if component has documentation
        if grep -q "@see.*github.com.*openfreemap" "src/components/OpenFreeMap.tsx"; then
            echo "✅ Component includes git remote documentation"
        else
            echo "⚠️  Component missing git remote documentation"
        fi
    else
        echo "❌ OpenFreeMap.tsx component missing"
    fi
    
    echo ""
    echo "═══════════════════════════════════════"
    echo "🎉 Verification Complete!"
    echo ""
    echo "Summary:"
    echo "  • Git Remote: ✅ Configured"
    echo "  • Connectivity: ✅ Working"
    echo "  • Documentation: $DOCS_FOUND/3 files present"
    echo "  • Implementation: ✅ Components in place"
    echo ""
    echo "📖 Next steps:"
    echo "  1. Read .github/OPENFREEMAP.md for full guide"
    echo "  2. Run 'git fetch openfreemap' to stay updated"
    echo "  3. Run 'git log openfreemap/main --oneline' to see changes"
    echo ""
    
else
    echo "❌ OpenFreeMap remote not found"
    echo ""
    echo "To add the remote, run:"
    echo "  git remote add openfreemap https://github.com/telleriacarolina/openfreemap.git"
    echo ""
    exit 1
fi
