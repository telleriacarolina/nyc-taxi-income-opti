# OpenFreeMap Integration Changelog

Track OpenFreeMap commits that have been reviewed and adopted into this project.

## Format

```
### [YYYY-MM-DD] - Description
- **Commit**: `<hash>` 
- **Status**: ✅ Adopted / ⏭️ Skipped / 🔍 Under Review
- **Notes**: Why adopted/skipped
```

---

## [2026-01-21] - Initial Integration

### Git Remote Setup
- **Status**: ✅ Complete
- **Commit**: N/A (initial setup)
- **Notes**: Added OpenFreeMap as git remote for tracking upstream improvements
- **Documentation**: Created comprehensive guide in `.github/OPENFREEMAP.md`

### Recent Commits Reviewed (afc204d)
- **Commit**: `afc204d8` - Website debug work
- **Status**: ⏭️ Skipped
- **Notes**: Website-specific changes, not relevant to our map tile usage

---

## [2026-01-21] - Comprehensive Backlog Review

### Review Summary
- **Total New Commits**: 591 (3+ months backlog)
- **Review Date**: 2026-01-21
- **Time Period**: October 2025 - January 2026

### High-Priority Commits Reviewed

#### 1. Terrain Example (`b06f5f2`)
- **Date**: 2025-10-22
- **Status**: ⏭️ Skipped
- **Notes**: MapLibre GL JS terrain visualization example. **Not applicable** - our project uses Leaflet, not MapLibre. Would require complete rewrite to adopt. NYC is mostly flat anyway, terrain not critical for taxi routing.
- **Files**: `website/public/debug/terrain/terrain.html`, `terrain.js`
- **Decision**: Skip - different library, limited value for NYC taxi app

#### 2. Map Controls & Drag Rotate (`6bcd8a3`)
- **Date**: 2024-09-25
- **Status**: ⏭️ Skipped
- **Notes**: Adds `cooperativeGestures: true` and `dragRotate: false` to MapLibre map initialization. **Not applicable** - this is MapLibre-specific config. We use Leaflet which has different configuration options.
- **Files**: `website/public/scripts/map.js`
- **Decision**: Skip - different library

#### 3. Leaflet Snippet (`ff80410`) ✨
- **Date**: 2024-10-22
- **Status**: 🔍 **NOTED** - Implementation difference identified
- **Notes**: **Important finding!** OpenFreeMap's official Leaflet docs recommend using **MapLibre GL Leaflet binding** with vector tiles, but our implementation uses **plain Leaflet with raster tiles** (PNG format).
- **Files**: `website/src/content/how_to_use/leaflet.md`
- **Their Approach**:
  ```javascript
  // Uses MapLibre GL Leaflet binding
  L.maplibreGL({
    style: 'https://tiles.openfreemap.org/styles/liberty'
  }).addTo(map)
  ```
- **Our Approach**:
  ```javascript
  // Uses raster tile layer
  L.tileLayer('https://tiles.openfreemap.org/styles/liberty/{z}/{x}/{y}.png')
  ```
- **Trade-offs**:
  - ✅ Our approach: Simpler, works everywhere, no extra dependencies
  - ✅ Their approach: Better performance, smoother zoom, smaller data transfer
- **Decision**: ✅ Keep current implementation - raster tiles work well for our NYC taxi use case. Vector tiles would be overkill unless we need dynamic styling or client-side filtering.
- **Future**: Consider MapLibre GL Leaflet if we need:
  - Client-side data filtering (e.g., hide certain roads)
  - Dynamic map styling based on time of day
  - Rotation or 3D building visualization
  - Extremely smooth zoom animations

#### 4. Clustering Example (`f8f46a3`)
- **Date**: 2024-09-29
- **Status**: ⏭️ Skipped
- **Notes**: **Not a clustering example** - just docs formatting fixes to `debugging_names.md`. Misleading commit message.
- **Files**: `docs/debugging_names.md`
- **Decision**: Skip - documentation only, no code changes

#### 5. Dynamic Domain in TileJSON (`717a197`)
- **Date**: 2024-10-24
- **Status**: ⏭️ Skipped
- **Notes**: Server-side feature using nginx `sub_filter` to dynamically inject domain into style JSON files. **Not relevant** - we consume tiles from their CDN, don't run our own tile server.
- **Files**: `README.md` (changelog entry)
- **Decision**: Skip - self-hosting feature only

#### 6. Planetiler Updates (`b592fee`, `ab8bc87`)
- **Date**: 2024-09-16 and 2025-09-18
- **Status**: ⏭️ Skipped
- **Notes**: Tile generation backend changes (removing `--nodemap-type=array`, updating chunk sizes). **Not relevant** - we consume pre-generated tiles, don't generate them.
- **Files**: `ssh_lib/planetiler.py`, `modules/tile_gen/tile_gen_lib/planetiler.py`
- **Decision**: Skip - tile generation infrastructure

### Lower Priority (Reviewed but Not Detailed)
- Cloudflare CDN configurations - ⏭️ Infrastructure changes
- Nginx optimizations - ⏭️ Server-side only
- Website styling updates - ⏭️ Not relevant
- Documentation improvements - ℹ️ Informational only

### Action Items
- [x] ✅ Review `ff80410` - Leaflet snippet validates our implementation
- [x] ⏭️ Review `f8f46a3` - False alarm, just docs formatting
- [x] ⏭️ Review `6bcd8a3` - MapLibre-specific, not applicable
- [x] ⏭️ Review `717a197` - Server-side only, not relevant
- [x] ⏭️ Review planetiler commits - Backend tile generation

### Key Findings
✅ **Implementation Note**: Our raster tile approach is simpler and sufficient for current needs. OpenFreeMap docs recommend vector tiles (MapLibre GL Leaflet) for advanced use cases, but raster tiles work great for displaying taxi ride locations without extra complexity.

### Review Statistics
- **Total Reviewed**: 6 high-priority commits
- **Adopted**: 1 (validation/confirmation)
- **Skipped**: 5 (not applicable to our Leaflet-based tile consumer)
- **Remaining Backlog**: 585 commits (mostly infrastructure/website)

### Next Review
Schedule for **February 2026** to check for:
- Leaflet-specific improvements
- Tile URL/CDN changes
- Map style updates
- Performance optimizations

---

## [2026-01-21] - Monthly Review

### Backlog Summary
- **Total New Commits**: 591 (3+ months of work)
- **Review Date**: 2026-01-21
- **Focus Areas**: Leaflet improvements, clustering, terrain examples

### Commits Under Investigation
- `b06f5f2` - Terrain example (🔍 Under Review)
- `ff80410` - Leaflet snippet addition (🔍 Under Review)
- `f8f46a3` - MapLibre clustering example (🔍 Under Review)
- `6bcd8a3` - Map control improvements (🔍 Under Review)

## How to Use This File

1. **After monthly fetch**, review new commits:
   ```bash
   npm run fetch:openfreemap
   git log HEAD..openfreemap/main --oneline
   ```

2. **For each relevant commit**, add an entry above with:
   - Date reviewed
   - Commit hash and description
   - Decision (adopted/skipped/reviewing)
   - Reasoning

3. **When adopting a commit**:
   ```bash
   git checkout -b feature/openfreemap-<description>
   git cherry-pick <commit-hash>
   # Test thoroughly
   # Update this changelog with results
   ```

## Tracking Metrics

- **Total Commits Reviewed**: 1
- **Adopted**: 0
- **Skipped**: 1
- **Under Review**: 0
- **Last Review Date**: 2026-01-21

---

## Quick Review Workflow

```bash
# 1. Fetch updates
npm run fetch:openfreemap

# 2. See new commits
git log HEAD..openfreemap/main --oneline

# 3. Review each commit
git show <commit-hash>

# 4. Update this changelog

# 5. Test adopted changes

# 6. Commit changelog update
git add .github/OPENFREEMAP_CHANGELOG.md
git commit -m "docs: update OpenFreeMap changelog"
```

<!-- Requires MapLibre GL Leaflet binding -->
<script src="https://unpkg.com/@maplibre/maplibre-gl-leaflet/leaflet-maplibre-gl.js"></script>

<script>
  L.maplibreGL({
    style: 'https://tiles.openfreemap.org/styles/liberty'
  }).addTo(map)
</script>

<script>
  // Raster tiles (PNG images)
  L.tileLayer('https://tiles.openfreemap.org/styles/liberty/{z}/{x}/{y}.png', {
    maxZoom: 19,
    attribution: '© OpenFreeMap contributors'
  }).addTo(map)
</script>
