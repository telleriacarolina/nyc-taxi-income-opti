#!/bin/bash
# OpenFreeMap Git Remote Verification Script
# Verifies remote wiring, connectivity, docs, and component presence. Suitable for CI.

set -o pipefail

echo "🔍 OpenFreeMap Git Remote Verification"
echo "========================================"
echo ""

remote_ok=0
connectivity_ok=0
fetch_ok=0
docs_found=0
docs_total=3
component_ok=0
component_docs_ok=0

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
    remote_ok=1
    
    # Show remote details
    echo "📋 Remote Configuration:"
    git remote -v | grep openfreemap
    echo ""
    
    # Try to fetch (this will test connectivity)
    echo "🌐 Testing connectivity to OpenFreeMap repository..."
    if git ls-remote openfreemap HEAD > /dev/null 2>&1; then
        echo "✅ Successfully connected to OpenFreeMap repository"
        echo ""
        connectivity_ok=1
        
        # Show latest commit on main branch
        echo "📌 Latest OpenFreeMap commit:"
        git ls-remote openfreemap refs/heads/main | cut -f1 | head -c 8
        echo ""
        echo ""
        
        # Fetch latest changes
        echo "⬇️  Fetching latest changes from OpenFreeMap..."
        if git fetch openfreemap > /tmp/openfreemap-fetch.log 2>&1; then
            echo "✅ Fetch successful"
            echo ""
            fetch_ok=1
            
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
            echo "⚠️  Fetch completed with warnings (see /tmp/openfreemap-fetch.log)"
            echo ""
        fi
    else
        echo "⚠️  Warning: Could not connect to OpenFreeMap repository"
        echo "    This might be a network issue or temporary problem"
        echo ""
    fi
    
    # Check documentation files
    echo "📚 Checking documentation files..."
    if [ -f ".github/OPENFREEMAP.md" ]; then
        echo "✅ .github/OPENFREEMAP.md exists"
        docs_found=$((docs_found + 1))
    else
        echo "❌ .github/OPENFREEMAP.md missing"
    fi

    if [ -f ".github/GIT_REMOTES.md" ]; then
        echo "✅ .github/GIT_REMOTES.md exists"
        docs_found=$((docs_found + 1))
    else
        echo "❌ .github/GIT_REMOTES.md missing"
    fi

    if [ -f ".github/IMPLEMENTATION_SUMMARY.md" ]; then
        echo "✅ .github/IMPLEMENTATION_SUMMARY.md exists"
        docs_found=$((docs_found + 1))
    else
        echo "❌ .github/IMPLEMENTATION_SUMMARY.md missing"
    fi

    echo ""
    
    # Check for OpenFreeMap component
    echo "🗺️  Checking OpenFreeMap implementation..."
    if [ -f "src/components/OpenFreeMap.tsx" ]; then
        echo "✅ OpenFreeMap.tsx component exists"
        component_ok=1

        # Check if component has documentation
        if grep -q "@see.*github.com.*openfreemap" "src/components/OpenFreeMap.tsx"; then
            echo "✅ Component includes git remote documentation"
            component_docs_ok=1
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
    echo "  • Git Remote: $([ $remote_ok -eq 1 ] && echo "✅" || echo "❌")"
    echo "  • Connectivity: $([ $connectivity_ok -eq 1 ] && echo "✅" || echo "❌")"
    echo "  • Fetch: $([ $fetch_ok -eq 1 ] && echo "✅" || echo "⚠️")"
    echo "  • Documentation: $docs_found/$docs_total present $([ $docs_found -eq $docs_total ] && echo "✅" || echo "❌")"
    echo "  • Component: $([ $component_ok -eq 1 ] && echo "✅" || echo "❌")"
    echo "  • Component Docs: $([ $component_docs_ok -eq 1 ] && echo "✅" || echo "⚠️")"
    echo ""
    echo "📖 Next steps:"
    echo "  1. Read .github/OPENFREEMAP.md for full guide"
    echo "  2. Run 'git fetch openfreemap' to stay updated"
    echo "  3. Run 'git log openfreemap/main --oneline' to see changes"
    echo ""

    # Exit code for CI: fail on missing remote, connectivity, docs, or component
    if [ $remote_ok -eq 0 ] || [ $connectivity_ok -eq 0 ] || [ $docs_found -lt $docs_total ] || [ $component_ok -eq 0 ]; then
        exit 1
    fi
    exit 0
    
else
    echo "❌ OpenFreeMap remote not found"
    echo ""
    echo "To add the remote, run:"
    echo "  git remote add openfreemap https://github.com/telleriacarolina/openfreemap.git"
    echo ""
    exit 1
fi
