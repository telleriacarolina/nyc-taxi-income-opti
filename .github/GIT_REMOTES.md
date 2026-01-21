# Git Configuration

## Configured Remotes

### origin
- **URL**: https://github.com/telleriacarolina/nyc-taxi-income-opti.git
- **Purpose**: Main project repository
- **Usage**: Primary development, pull requests, releases

### openfreemap
- **URL**: https://github.com/telleriacarolina/openfreemap.git
- **Purpose**: OpenFreeMap tile server and MapLibre implementation reference
- **Usage**: Track upstream map features, compare implementations, cherry-pick improvements

## Git Workflow

### Daily Development

```bash
# Work on main project
git pull origin main
git checkout -b feature/my-feature
# Make changes
git commit -m "feat: add new feature"
git push origin feature/my-feature
```

### Tracking OpenFreeMap Updates

```bash
# Fetch latest OpenFreeMap changes (run monthly)
git fetch openfreemap

# View what's new in OpenFreeMap
git log HEAD..openfreemap/main --oneline --graph

# Compare our map implementation with theirs
git diff main openfreemap/main -- src/components/OpenFreeMap.tsx

# View specific file from OpenFreeMap repo
git show openfreemap/main:path/to/file
```

### Integrating OpenFreeMap Features

```bash
# Create test branch
git checkout -b test/openfreemap-feature

# Cherry-pick specific commit from OpenFreeMap
git cherry-pick <commit-hash>

# Or attempt merge (with care)
git merge openfreemap/main --no-commit --no-ff

# Review changes carefully
git diff --cached

# If looks good, commit
git commit -m "feat: integrate OpenFreeMap feature X"

# Otherwise, abort
git merge --abort
```

### Branch Management

```bash
# List all branches including remotes
git branch -a

# List only OpenFreeMap remote branches
git branch -r | grep openfreemap

# Create local branch tracking OpenFreeMap branch
git checkout -b openfreemap-feature openfreemap/feature-branch
```

## Maintenance Commands

```bash
# Verify remotes are configured
git remote -v

# Update remote URLs if needed
git remote set-url openfreemap https://github.com/telleriacarolina/openfreemap.git

# Remove remote (not recommended)
git remote remove openfreemap

# Re-add remote if removed
git remote add openfreemap https://github.com/telleriacarolina/openfreemap.git

# Prune stale remote branches
git fetch --prune openfreemap
```

## Best Practices

1. **Fetch regularly**: Run `git fetch openfreemap` monthly to track upstream
2. **Review before merge**: Always use `--no-commit` when testing upstream merges
3. **Test thoroughly**: Create test branches for OpenFreeMap integrations
4. **Document changes**: Note OpenFreeMap commit hashes when cherry-picking
5. **Keep separate**: Avoid pushing to openfreemap remote (read-only usage)

## References

- [OpenFreeMap Integration Guide](.github/OPENFREEMAP.md)
- [Git Documentation](https://git-scm.com/doc)
- [Working with Remotes](https://git-scm.com/book/en/v2/Git-Basics-Working-with-Remotes)
