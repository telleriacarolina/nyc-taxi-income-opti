# OpenFreeMap Integration Guide

This document describes the OpenFreeMap integration in this project and how to work with the OpenFreeMap git remote.

## Overview

This project uses [OpenFreeMap](https://openfreemap.org/) tiles for interactive mapping functionality, providing:

- ✅ **Free & open-source** mapping without API keys
- 🚀 **Fast CDN delivery** via Cloudflare
- 🔒 **Privacy-focused** with no tracking
- 🎨 **Multiple map styles** (Liberty, Bright, Positron)
- 🗺️ **NYC-optimized** for taxi/rideshare visualization

## Git Remote Setup

The OpenFreeMap repository is configured as a git remote for reference and development purposes.

### Verify Remote Configuration

```bash
git remote -v
```

You should see:
```
openfreemap  https://github.com/telleriacarolina/openfreemap.git (fetch)
openfreemap  https://github.com/telleriacarolina/openfreemap.git (push)
```

### Fetch Latest Updates

```bash
# Fetch all branches and tags from OpenFreeMap
git fetch openfreemap

# View available branches
git branch -r | grep openfreemap

# View recent commits
git log openfreemap/main --oneline -10
```

### Compare Implementations

```bash
# Compare our OpenFreeMap component with upstream
git diff main openfreemap/main -- src/components/

# Show changes in specific files
git diff main openfreemap/main -- src/components/OpenFreeMap.tsx

# View file from OpenFreeMap repository
git show openfreemap/main:path/to/file
```

### Integrate Upstream Changes

```bash
# Cherry-pick specific commits (use with caution)
git cherry-pick <commit-hash>

# View commit details before cherry-picking
git show <commit-hash>

# Create a temporary branch to test upstream changes
git checkout -b test-openfreemap-update
git merge openfreemap/main --no-commit --no-ff
# Review changes, then either commit or abort
git merge --abort  # if you want to cancel
```

## Implementation Details

### Components Using OpenFreeMap

1. **`src/components/OpenFreeMap.tsx`**
   - Core map component using Leaflet
   - Liberty style tiles from `https://tiles.openfreemap.org/styles/liberty/{z}/{x}/{y}.png`
   - Custom markers for earnings visualization
   - NYC-centered by default (40.7128, -74.0060)

2. **`src/components/LocationHeatmap.tsx`**
   - Earnings heatmap with map view
   - Uses OpenFreeMap for geographic earnings visualization
   - Displays NYC neighborhoods with earnings markers

3. **`src/components/TrafficOverlay.tsx`**
   - Real-time traffic visualization
   - Shows traffic speeds and incidents on OpenFreeMap
   - Borough-filtered views

### Tile Server Configuration

**Current Configuration:**
- **Tile URL**: `https://tiles.openfreemap.org/styles/liberty/{z}/{x}/{y}.png`
- **Max Zoom**: 19
- **Attribution**: `© OpenFreeMap contributors`
- **CDN**: Cloudflare-backed for fast global delivery

### Dependencies

```json
{
  "@types/leaflet": "^1.9.21",
  "leaflet": "^1.9.4"
}
```

## Development Workflows

### Testing Map Updates

When testing changes related to OpenFreeMap:

```bash
# Start development server
npm run dev

# Watch for changes
npm run dev -- --host
```

### Comparing Tile Styles

OpenFreeMap offers three tile styles. To switch styles, update the tile URL in `OpenFreeMap.tsx`:

```typescript
// Liberty (current - colorful, detailed)
'https://tiles.openfreemap.org/styles/liberty/{z}/{x}/{y}.png'

// Bright (clean, professional)
'https://tiles.openfreemap.org/styles/bright/{z}/{x}/{y}.png'

// Positron (minimal, data overlays)
'https://tiles.openfreemap.org/styles/positron/{z}/{x}/{y}.png'
```

### Customizing Styles

Use [Maputnik](https://maputnik.github.io/editor/) to customize map styles:

1. Open [Maputnik Editor](https://maputnik.github.io/editor/#https://tiles.openfreemap.org/styles/liberty)
2. Edit the Liberty style
3. Export custom style JSON
4. Host custom style or convert to raster tiles

## Troubleshooting

### Map Not Displaying

1. **Check network requests** - Verify tiles are loading from `tiles.openfreemap.org`
2. **Check console** - Look for CORS or CSP errors
3. **Verify coordinates** - Ensure lat/lng are valid (NYC: 40.7128, -74.0060)
4. **Check zoom level** - Valid range is 0-19

### Slow Tile Loading

1. **Check network conditions** - OpenFreeMap uses Cloudflare CDN
2. **Reduce initial markers** - Too many markers can slow rendering
3. **Use tile caching** - Leaflet automatically caches tiles

### Keeping Up with Upstream

```bash
# Check for new commits monthly
git fetch openfreemap
git log HEAD..openfreemap/main --oneline

# Review OpenFreeMap release notes
# Visit: https://github.com/telleriacarolina/openfreemap/releases
```

## Automated Checking & Reminders

### GitHub Actions (Recommended) - Auto-PR

The project includes automated monthly checks via GitHub Actions that **automatically creates a pull request** with changelog updates:

**Workflow**: `.github/workflows/check-openfreemap.yml`
- **Schedule**: Runs automatically on the 1st of each month at 9:00 AM UTC
- **Action**: 
  1. Fetches OpenFreeMap updates
  2. Creates a new branch (e.g., `openfreemap-updates-2026-01`)
  3. Auto-updates `.github/OPENFREEMAP_CHANGELOG.md` with new commits
  4. Creates a Pull Request with detailed commit summaries
- **Manual Trigger**: Can be triggered anytime from the Actions tab

**What You Get**:
- ✅ **Automated changelog updates** - No manual tracking needed
- ✅ **Pull Request with details** - Review commits in a structured PR
- ✅ **Labels applied** - `openfreemap`, `dependencies`, `automated`
- ✅ **Quick commands** - Pre-filled commands to review changes
- ✅ **Email notifications** - Automatic PR notifications

**Enable Notifications**:
1. Go to your repository on GitHub
2. Click "Watch" → "Custom" → Check "Pull Requests"
3. You'll receive email notifications when new PRs are created

**Workflow**:
1. GitHub Actions creates a PR on the 1st of each month (if updates exist)
2. Review the PR and commit details
3. Run `npm run review:openfreemap` to examine commits locally
4. Cherry-pick any relevant improvements (optional)
5. Merge the PR to update your changelog

**Manual Trigger**:
```bash
# From GitHub UI: Actions → Check OpenFreeMap Updates → Run workflow
# Or use GitHub CLI:
gh workflow run check-openfreemap.yml
```

### Local Reminders

#### Option 1: Cron Job (Linux/Mac)

Add to your crontab (`crontab -e`):

```bash
# Check OpenFreeMap updates on the 1st of each month at 9 AM
0 9 1 * * cd /workspaces/spark-template && npm run check:openfreemap && notify-send "OpenFreeMap Check" "New updates available"
```

#### Option 2: Calendar Reminder

Set a recurring calendar event:
- **Frequency**: Monthly (1st of month)
- **Action**: Run `npm run check:openfreemap` in project directory
- **Note**: Review `.github/OPENFREEMAP_CHANGELOG.md` and update if needed

#### Option 3: VS Code Tasks

Add to `.vscode/tasks.json`:

```json
{
  "version": "2.0.0",
  "tasks": [
    {
      "label": "Check OpenFreeMap Updates",
      "type": "shell",
      "command": "npm run check:openfreemap",
      "problemMatcher": [],
      "presentation": {
        "reveal": "always",
        "panel": "new"
      }
    }
  ]
}
```

Then run via: `Ctrl+Shift+P` → "Tasks: Run Task" → "Check OpenFreeMap Updates"

### Quick Check Command

Add this alias to your shell profile (`.bashrc` or `.zshrc`):

```bash
alias check-ofm='cd /workspaces/spark-template && npm run check:openfreemap'
```

Then simply run `check-ofm` from anywhere in your terminal.

## Performance Considerations

### Marker Optimization

When displaying many markers (e.g., hundreds of ride locations):

```typescript
// Use marker clustering for large datasets
import L from 'leaflet'
import 'leaflet.markercluster'

const markers = L.markerClusterGroup()
// Add markers to cluster group
map.addLayer(markers)
```

### Tile Loading

- Tiles are served via Cloudflare CDN (fast worldwide)
- Browser caches tiles automatically
- No rate limits or authentication required

## Self-Hosting Option

For production deployments with high traffic, consider self-hosting:

```bash
# Download OpenFreeMap Btrfs images
# See: https://github.com/hyperknot/openfreemap

# Host tiles on your infrastructure
# Full control and no external dependencies
```

## Resources

- **OpenFreeMap Website**: https://openfreemap.org/
- **OpenFreeMap Repository**: https://github.com/telleriacarolina/openfreemap
- **MapLibre GL JS**: https://maplibre.org/maplibre-gl-js/docs/
- **Leaflet Documentation**: https://leafletjs.com/
- **Maputnik Style Editor**: https://maputnik.github.io/editor/

## Contributing

When making changes to map components:

1. Test with multiple zoom levels (10-16 for NYC)
2. Verify marker performance with large datasets
3. Check mobile responsiveness
4. Ensure accessibility (keyboard navigation, ARIA labels)
5. Document any tile style changes

## License

OpenFreeMap tiles are provided under the OpenStreetMap license. See [OpenFreeMap License](https://openfreemap.org/) for details.

---

**Last Updated**: January 2026
**Maintainer**: NYC Taxi Income Optimizer Project
**OpenFreeMap Version**: Latest (git remote tracking)
