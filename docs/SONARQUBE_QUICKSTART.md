# SonarQube MCP Server - Quick Start Guide

## 🚀 30-Minute Setup

### Step 1: Install SonarQube MCP Server (5 minutes)

```bash
# Clone the repository
git clone https://github.com/telleriacarolina/sonarqube-mcp-server.git

# Navigate to the directory
cd sonarqube-mcp-server

# Install dependencies
npm install

# Link globally (optional)
npm link

# Or install in your project
cd /workspaces/spark-template
npm install --save-dev ../sonarqube-mcp-server
```

### Step 2: Get SonarQube Credentials (5 minutes)

**Option A: SonarQube Cloud (Recommended)**
1. Go to [SonarCloud](https://sonarcloud.io/)
2. Sign in with GitHub
3. Create new organization or use existing
4. Generate token: Account → Security → Generate Token
5. Note your organization key

**Option B: Self-hosted SonarQube Server**
1. Access your SonarQube server
2. Go to My Account → Security → Generate Token
3. Note your server URL

### Step 3: Configure Project (10 minutes)

Create `.env.local` (add to .gitignore):
```bash
SONARQUBE_URL=https://sonarcloud.io
SONARQUBE_TOKEN=your_token_here
SONARQUBE_ORG=your_org_key
SONARQUBE_PROJECT_KEY=nyc-taxi-income-optimizer
```

Create `sonar-project.properties`:
```properties
sonar.projectKey=nyc-taxi-income-optimizer
sonar.projectName=NYC TAXI Income Optimizer
sonar.sources=src
sonar.exclusions=**/node_modules/**,**/dist/**,**/*.test.ts
sonar.typescript.tsconfigPath=tsconfig.json
```

### Step 4: Add NPM Scripts (2 minutes)

In `package.json`, add to scripts:
```json
{
  "sonar:scan": "sonar-scanner",
  "sonar:check": "npm run sonar:scan && echo 'Analysis complete!'"
}
```

### Step 5: Run First Scan (5 minutes)

```bash
# Build project first
npm run build

# Run SonarQube scan
npm run sonar:scan

# View results at:
# https://sonarcloud.io/project/overview?id=nyc-taxi-income-optimizer
```

### Step 6: Add Quality Badge (3 minutes)

In `README.md`, add:
```markdown
[![Quality Gate Status](https://sonarcloud.io/api/project_badges/measure?project=nyc-taxi-income-optimizer&metric=alert_status)](https://sonarcloud.io/summary/new_code?id=nyc-taxi-income-optimizer)
[![Security Rating](https://sonarcloud.io/api/project_badges/measure?project=nyc-taxi-income-optimizer&metric=security_rating)](https://sonarcloud.io/summary/new_code?id=nyc-taxi-income-optimizer)
[![Bugs](https://sonarcloud.io/api/project_badges/measure?project=nyc-taxi-income-optimizer&metric=bugs)](https://sonarcloud.io/summary/new_code?id=nyc-taxi-income-optimizer)
```

## 🎯 Quick Commands

```bash
# Full analysis
npm run sonar:scan

# Analyze specific file
npx sonarqube-mcp analyze-snippet src/components/Button/Button.tsx

# Check quality gate
npx sonarqube-mcp check --project nyc-taxi-income-optimizer

# Generate report
npx sonarqube-mcp generate-report --output sonar-report.html
```

## 🔍 What Gets Analyzed

- **Bugs:** Logic errors, null pointer exceptions
- **Vulnerabilities:** SQL injection, XSS, CSRF
- **Code Smells:** Complexity, duplications, maintainability issues
- **Security Hotspots:** Areas requiring security review
- **Coverage:** Test coverage metrics
- **Duplications:** Duplicate code blocks

## 📊 Understanding Results

### Quality Gate: PASSED ✅
- 0 bugs in new code
- 0 vulnerabilities in new code
- Coverage ≥ 80% on new code
- Duplications < 3% on new code

### Quality Gate: FAILED ❌
Review the dashboard for:
1. Critical/Blocker issues
2. Security vulnerabilities
3. Coverage gaps
4. High complexity functions

## 🛠️ Common Issues & Fixes

### Issue: "Token authentication error"
**Fix:** Check `.env.local` has correct `SONARQUBE_TOKEN`

### Issue: "Project not found"
**Fix:** Verify `SONARQUBE_PROJECT_KEY` matches project in SonarCloud

### Issue: "No sources to analyze"
**Fix:** Check `sonar.sources=src` in `sonar-project.properties`

### Issue: "Quality gate failed"
**Fix:** Review issues in SonarCloud dashboard, fix critical/blocker issues first

## 🎓 Next Steps

1. **Review Dashboard:** Check code quality metrics
2. **Fix Critical Issues:** Resolve blocker and critical bugs
3. **Improve Coverage:** Add tests for uncovered code
4. **Reduce Complexity:** Refactor high-complexity functions
5. **Configure CI/CD:** See `SONARQUBE_MCP_INTEGRATION_PLAN.md` for GitHub Actions setup

## 📚 Resources

- [Full Integration Plan](./SONARQUBE_MCP_INTEGRATION_PLAN.md)
- [SonarCloud Dashboard](https://sonarcloud.io/)
- [TypeScript Rules](https://rules.sonarsource.com/typescript)
- [Security Best Practices](https://docs.sonarqube.org/latest/user-guide/security-hotspots/)

---

**Time to First Scan:** ~30 minutes  
**Time to Quality Gate:** ~2-4 hours (depending on issues found)
