# OpenFreeMap Git Remote - Quick Reference

## 🚀 Quick Start

### Verify Setup (First Time)
```bash
npm run verify:openfreemap
```

### Monthly Maintenance
```bash
# Quick check - shows how many new commits
npm run check:openfreemap

# Detailed review - shows commit history with dates
npm run review:openfreemap

# Compare files - shows what files changed
npm run compare:openfreemap
```

### Install Git Aliases (Optional)
```bash
# Add OpenFreeMap shortcuts to your git config
git config --global include.path "$(pwd)/.gitconfig-openfreemap"

# Now use shortcuts like:
git ofm-log        # Pretty log
git ofm-new        # Show new commits
git ofm-tiles      # Filter tile-related commits
```

## 📋 Common Commands

### Check Remote Status
```bash
# View configured remotes
git remote -v

# Check OpenFreeMap connection
git ls-remote openfreemap
```

### Fetch Updates
```bash
# Quick check with count
npm run check:openfreemap

# Fetch + pretty review
npm run review:openfreemap

# Or manually
git fetch openfreemap
```

### View Changes
```bash
# View recent commits
git log openfreemap/main --oneline -10

# Compare implementations
git diff main openfreemap/main -- src/components/OpenFreeMap.tsx

# Count new commits
git rev-list HEAD..openfreemap/main --count
```

### Filter Relevant Commits
```bash
# Using git aliases (after setup)
git ofm-tiles      # Tile-related commits
git ofm-maps       # Map-related commits
git ofm-perf       # Performance improvements
git ofm-recent     # Last month only

# Or manually
git log openfreemap/main --grep="tile\|map\|performance" --oneline
```

### Integrate Features
```bash
# Create test branch
git checkout -b test/openfreemap-feature

# Cherry-pick specific commit
git cherry-pick <commit-hash>

# View commit details first
git show <commit-hash>
```

## 📚 Documentation

| Document | Purpose | Location |
|----------|---------|----------|
| Integration Guide | Full setup and workflows | [.github/OPENFREEMAP.md](.github/OPENFREEMAP.md) |
| Git Remotes | Remote management | [.github/GIT_REMOTES.md](.github/GIT_REMOTES.md) |
| Implementation | What's been done | [.github/IMPLEMENTATION_SUMMARY.md](.github/IMPLEMENTATION_SUMMARY.md) |
| Changelog | Review history | [.github/OPENFREEMAP_CHANGELOG.md](.github/OPENFREEMAP_CHANGELOG.md) |
| Quick Reference | This file | [.github/QUICK_REFERENCE.md](.github/QUICK_REFERENCE.md) |

## 🛠️ NPM Scripts

| Command | Description |
|---------|-------------|
| `npm run verify:openfreemap` | Verify remote configuration and test connectivity |
| `npm run fetch:openfreemap` | Fetch latest updates from OpenFreeMap |
| `npm run check:openfreemap` | Fetch + show new commits count |
| `npm run compare:openfreemap` | Fetch + show file differences summary |
| `npm run review:openfreemap` | Fetch + show pretty commit log with dates |
| `npm run dev` | Start development server with maps |
| `npm run build` | Build production bundle |

## 🤖 Automation

### GitHub Actions (Optional)
The workflow at `.github/workflows/check-openfreemap.yml` automatically:
- Checks for OpenFreeMap updates monthly
- Creates a GitHub issue if updates are available
- Includes commit summaries and review instructions

Enable by pushing the workflow file to your repository.

### Git Aliases
Install shortcuts for common OpenFreeMap operations:

```bash
# One-time setup
git config --global include.path "$(pwd)/.gitconfig-openfreemap"

# Usage examples
git ofm-log           # Pretty commit log
git ofm-new           # Show commits you haven't reviewed
git ofm-count         # Count new commits
git ofm-tiles         # Filter tile-related changes
git ofm-component     # Compare your OpenFreeMap component
git ofm-test          # Create dated test branch
```

## 🗺️ Component Files

| File | Purpose |
|------|---------|
| `src/components/OpenFreeMap.tsx` | Core map component (Leaflet + OpenFreeMap tiles) |
| `src/components/LocationHeatmap.tsx` | Earnings visualization with map view |
| `src/components/TrafficOverlay.tsx` | Traffic visualization on map |

## 🔗 Important Links

- **OpenFreeMap Website**: https://openfreemap.org/
- **OpenFreeMap Repository**: https://github.com/telleriacarolina/openfreemap
- **Tile URL**: https://tiles.openfreemap.org/styles/liberty/{z}/{x}/{y}.png
- **MapLibre Docs**: https://maplibre.org/maplibre-gl-js/docs/
- **Maputnik Editor**: https://maputnik.github.io/editor/

## ⚡ Quick Tips

1. **Monthly review**: `npm run check:openfreemap`
2. **Track reviews**: Update `.github/OPENFREEMAP_CHANGELOG.md`
3. **Test before merging**: Always use test branches
4. **Document cherry-picks**: Note commit hashes in messages
5. **Focus on value**: Look for tile server, performance, or map feature improvements

## 🐛 Troubleshooting

### Remote Not Found
```bash
# Add remote manually
git remote add openfreemap https://github.com/telleriacarolina/openfreemap.git
```

### Connection Issues
```bash
# Test connection
git ls-remote openfreemap

# Check network/proxy settings
curl -I https://github.com/telleriacarolina/openfreemap.git
```

### Map Not Displaying
```bash
# Check development server
npm run dev

# Verify tile URL in browser console
# Should see requests to: tiles.openfreemap.org
```

## 📞 Support

- See [.github/OPENFREEMAP.md](.github/OPENFREEMAP.md) for detailed troubleshooting
- Check [PRD.md](../PRD.md) for feature specifications
- Review [README.md](../README.md) for general setup

---

**Last Updated**: January 2026  
**Quick Access**: Bookmark this file for rapid reference
