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
