# SonarQube Coverage Configuration - Complete Setup

## ✅ Configuration Status

Your SonarQube coverage integration is **fully configured** and ready to use!

## 📋 What's Configured

### 1. **Vitest Coverage Configuration** ([vitest.config.ts](../vitest.config.ts))

```typescript
coverage: {
  provider: 'v8',                        // Using V8 coverage engine
  reporter: ['text', 'json', 'html', 'lcov'], // Multiple formats including lcov
  reportsDirectory: './coverage',        // Output directory
  exclude: [
    'node_modules/',
    'src/test/',
    '**/*.d.ts',
    '**/*.config.*',
    '**/*.test.{ts,tsx}',
    '**/*.spec.{ts,tsx}',
  ],
  include: ['src/**/*.{ts,tsx}'],
  all: true,
  thresholds: {
    lines: 80,
    functions: 80,
    branches: 80,
    statements: 80,
  }
}
```

**Key Settings:**
- ✅ **LCOV format enabled** - Required by SonarQube
- ✅ **Output path**: `./coverage/lcov.info`
- ✅ **Thresholds**: 80% for all metrics
- ✅ **Test files excluded** from coverage

### 2. **SonarQube Configuration** ([sonar-project.properties](../sonar-project.properties))

```properties
# Coverage report location (matches Vitest output)
sonar.javascript.lcov.reportPaths=coverage/lcov.info

# Code coverage exclusions (matches Vitest excludes)
sonar.coverage.exclusions=**/*.test.ts,\
  **/*.test.tsx,\
  **/*.spec.ts,\
  **/*.spec.tsx,\
  **/*.d.ts,\
  **/types/**
```

**Key Settings:**
- ✅ **Report path matches** Vitest output location
- ✅ **Exclusions configured** to match test files
- ✅ **Language set to TypeScript**

### 3. **NPM Scripts** ([package.json](../package.json))

```json
{
  "test": "vitest",
  "test:coverage": "vitest run --coverage",
  "sonar:scan": "sonar-scanner",
  "sonar:analyze": "npm run test:coverage && npm run sonar:scan"
}
```

**Pipeline Flow:**
```
npm run sonar:analyze
  ↓
1. Run tests with coverage (vitest run --coverage)
  ↓
2. Generate lcov.info in coverage/
  ↓
3. Run SonarQube scanner
  ↓
4. Upload coverage to SonarCloud
```

## 🚀 How to Use

### Run Full Analysis with Coverage

```bash
npm run sonar:analyze
```

This will:
1. ✅ Run all tests
2. ✅ Generate coverage report in `coverage/lcov.info`
3. ✅ Run SonarQube scanner
4. ✅ Upload code analysis + coverage to SonarCloud

### Run Tests Only

```bash
# Run tests in watch mode
npm test

# Run tests once with coverage
npm run test:coverage

# Run tests with UI
npm run test:ui
```

### View Coverage Locally

After running `npm run test:coverage`, open:
```bash
# Open coverage report in browser
open coverage/index.html
# or
xdg-open coverage/index.html
```

## 📊 Coverage Files Generated

```
coverage/
├── lcov.info              # Used by SonarQube
├── coverage-final.json    # Raw coverage data
├── index.html            # HTML report
└── lcov-report/          # Detailed HTML reports
    └── index.html
```

## 🎯 Coverage Thresholds

Current thresholds (80% for all):
- **Lines**: 80%
- **Functions**: 80%
- **Branches**: 80%
- **Statements**: 80%

If tests fail to meet thresholds:
```bash
ERROR: Coverage for lines (75%) does not meet threshold (80%)
```

To adjust thresholds, edit [vitest.config.ts](../vitest.config.ts):
```typescript
coverage: {
  lines: 70,      // Lower to 70%
  functions: 70,
  branches: 70,
  statements: 70,
}
```

## 🔍 SonarQube Coverage Metrics

Once uploaded to SonarCloud, you'll see:

### Overall Coverage
- **New Code**: Coverage on recently added code
- **Overall Code**: Total project coverage

### Detailed Metrics
- **Line Coverage**: % of executable lines covered
- **Branch Coverage**: % of conditional branches covered
- **Conditions Coverage**: % of boolean conditions tested

## 🛠️ Troubleshooting

### Issue: "No coverage information"
**Check:**
```bash
# 1. Verify lcov.info exists
ls -lh coverage/lcov.info

# 2. Check file has content
head -20 coverage/lcov.info

# 3. Verify path in sonar-project.properties
grep "lcov.reportPaths" sonar-project.properties
```

### Issue: "Coverage percentage is 0%"
**Solution:**
1. Ensure tests are passing:
   ```bash
   npm run test:coverage
   ```
2. Check that source files are included:
   ```bash
   grep "SF:" coverage/lcov.info | head -5
   ```
3. Verify exclusions don't exclude everything

### Issue: "Tests fail before scan"
**Options:**
1. Fix failing tests
2. Or run scan without coverage (not recommended):
   ```bash
   npm run sonar:scan
   ```

## 📈 Best Practices

### 1. **Run Coverage Before Committing**
```bash
npm run test:coverage
```

### 2. **Check Coverage Trends**
- Monitor coverage in SonarCloud dashboard
- Aim to increase coverage over time
- Prioritize critical paths first

### 3. **Write Meaningful Tests**
- Don't just aim for 100% coverage
- Focus on testing business logic
- Test edge cases and error conditions

### 4. **Review Coverage Reports**
```bash
# HTML report shows uncovered lines in red
open coverage/lcov-report/index.html
```

### 5. **CI/CD Integration**
Add to GitHub Actions:
```yaml
- name: Run Tests with Coverage
  run: npm run test:coverage

- name: SonarCloud Scan
  run: npm run sonar:scan
  env:
    SONAR_TOKEN: ${{ secrets.SONAR_TOKEN }}
```

## 📚 Additional Resources

- [Vitest Coverage Docs](https://vitest.dev/guide/coverage.html)
- [SonarQube JavaScript Coverage](https://docs.sonarqube.org/latest/analysis/coverage/)
- [LCOV Format Spec](http://ltp.sourceforge.net/coverage/lcov/geninfo.1.php)

## ✅ Ready to Scan!

Your coverage pipeline is complete:

```bash
# Run full analysis with coverage
npm run sonar:analyze
```

**Note:** First create your project in SonarCloud at https://sonarcloud.io/projects/create

Then view your coverage at:
`https://sonarcloud.io/project/overview?id=telleriacarolina_nyc-taxi-income-opti`

---

**Last Updated:** January 25, 2026  
**Status:** ✅ Fully Configured
