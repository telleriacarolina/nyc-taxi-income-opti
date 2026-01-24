# Workspace Cleanup Instructions

This document describes the cleanup and reorganization performed on the codebase.

## Files to be Deleted

### 1. Empty and Garbage Files
```bash
rm -f "0"
rm -f "that touch map components"
rm -f "changed in relevant commits"
```

These files appear to be accidental creations or temporary files:
- `0` - Empty file
- `that touch map components` - Git log output (70 lines)
- `changed in relevant commits` - Less pager output (259 lines)

### 2. Duplicate Documentation Files

#### OPENFREEMAP.md
```bash
rm -f OPENFREEMAP.md  # Root duplicate
# Keep: .github/OPENFREEMAP.md (328 lines - more complete)
```
- Root version: 235 lines
- .github version: 328 lines (more comprehensive)
- **Action**: Delete root version, keep .github version

#### REBUILD_REQUIRED.md
```bash
rm -f REBUILD_REQUIRED.md  # Root duplicate (redirect file)
# Keep: docs/docker/REBUILD_REQUIRED.md (complete guide)
```
- Root version: Only contains redirect message
- docs/docker version: Complete 64-line guide
- **Action**: Delete root version, keep docs/docker version

### 3. Unused Package
```bash
rm -rf packages/spark-tools
rmdir packages  # If empty after removal
```
- Contains generic Spark/GitHub package boilerplate
- Not used by this taxi optimization project
- Only contains: LICENSE, package.json, dist/, node_modules/

## Files to be Moved to docs/

Consolidate all documentation into the `docs/` folder for better organization:

```bash
mkdir -p docs

# Move documentation files
mv AI_INSIGHTS_DATABASE.md docs/
mv DATABASE_AI_IMPLEMENTATION.md docs/
mv LOCATION_PERMISSIONS.md docs/
mv PYTHON_SETUP.md docs/
mv SECURITY.md docs/
mv "Code Reviewer.md" docs/code-reviewer.md  # Also normalize filename
```

## Updated Documentation Structure

After cleanup:

```
/workspaces/spark-template/
├── docs/
│   ├── AI_INSIGHTS_DATABASE.md          [MOVED]
│   ├── DATABASE_AI_IMPLEMENTATION.md    [MOVED]
│   ├── LOCATION_PERMISSIONS.md          [MOVED]
│   ├── PYTHON_SETUP.md                  [MOVED]
│   ├── SECURITY.md                      [MOVED]
│   ├── code-reviewer.md                 [MOVED & RENAMED]
│   └── docker/
│       ├── DOCKER.md
│       ├── DOCKER_DEVCONTAINER_GUIDE.md
│       ├── DOCKER_QUICKSTART.md
│       └── REBUILD_REQUIRED.md
├── .github/
│   ├── OPENFREEMAP.md                   [KEPT - most complete version]
│   ├── OPENFREEMAP_CHANGELOG.md
│   ├── QUICK_REFERENCE.md
│   ├── GIT_REMOTES.md
│   └── IMPLEMENTATION_SUMMARY.md
├── README.md                             [UPDATED - references fixed]
├── PRD.md
├── LICENSE
├── package.json
└── ... (other project files)
```

## README.md Updates

✅ **Already Updated**: References to moved documentation files have been updated in README.md:
- `PYTHON_SETUP.md` → `docs/PYTHON_SETUP.md`
- Added references to newly organized docs:
  - `docs/SECURITY.md`
  - `docs/AI_INSIGHTS_DATABASE.md`
  - `docs/LOCATION_PERMISSIONS.md`

## Execution

To apply these changes, run the cleanup script that was created:

```bash
chmod +x cleanup.sh
./cleanup.sh
```

Or execute the commands manually:

```bash
# Delete garbage files
rm -f "0" "that touch map components" "changed in relevant commits"

# Delete duplicates
rm -f OPENFREEMAP.md REBUILD_REQUIRED.md

# Move docs to docs/
mkdir -p docs
mv AI_INSIGHTS_DATABASE.md docs/
mv DATABASE_AI_IMPLEMENTATION.md docs/
mv LOCATION_PERMISSIONS.md docs/
mv PYTHON_SETUP.md docs/
mv SECURITY.md docs/
mv "Code Reviewer.md" docs/code-reviewer.md

# Remove unused package
rm -rf packages/spark-tools
rmdir packages  # Only if empty
```

## Benefits of This Cleanup

1. **Eliminated Duplicates**: Removed 2 duplicate documentation files
2. **Removed Garbage**: Deleted 3 accidental/temporary files
3. **Better Organization**: Consolidated all docs into `docs/` folder
4. **Removed Unused Code**: Deleted spark-tools package (unrelated to this project)
5. **Updated References**: Fixed all links in README.md
6. **Cleaner Root**: Root directory now only contains essential project files

## Files Remaining in Root (Intentional)

- `PRD.md` - Product Requirements (primary reference document)
- `README.md` - Main project documentation
- `LICENSE` - Project license
- Configuration files: `package.json`, `tsconfig.json`, `vite.config.ts`, etc.
- Development files: `.dockerignore`, `.gitignore`, etc.

All other documentation is now properly organized in subdirectories.
